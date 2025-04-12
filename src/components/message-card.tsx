import { IMessage } from "@/models/message.model";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const MessageCard = ({ message, fetchMessages }: { message: IMessage, fetchMessages: () => Promise<void> }) => {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  // Format the date to show how long ago the message was sent
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  const handleDelete = async (messageId: string) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/messages/delete-message`, {
        data: {
          id: session?.user?._id,
          messageId,
        },
      });
      toast.success(response.data.message);
      await fetchMessages();
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-5 max-w-md w-full mx-auto border border-gray-800 group relative hover:border-indigo-900/50 hover:bg-gray-900/90 transform hover:translate-y-[-2px]">
      {/* Delete button with loader */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-all p-1.5 rounded-full hover:bg-gray-800/80 opacity-70 hover:opacity-100 group-hover:opacity-90 cursor-pointer"
        onClick={() => handleDelete(message._id.toString())}
        disabled={isDeleting}
        aria-label="Delete message"
      >
        {isDeleting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>

      {/* User info section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="p-0.5 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full group-hover:from-indigo-300 group-hover:to-indigo-500 transition-all duration-300">
            <Image
              className="rounded-full"
              src={session?.user?.image || "/default-user.png"}
              alt={session?.user?.name || "User"}
              width={52}
              height={52}
              quality={90}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-gray-900 animate-pulse"></div>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
              {session?.user?.name || "Anonymous"}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
            {session?.user?.email || "anonymous@user.com"}
          </p>
        </div>
      </div>

      {/* Message content */}
      <div className="pl-3 border-l-2 border-indigo-800 group-hover:border-indigo-600 transition-all bg-gray-800/30 p-3 rounded-r-lg">
        <p className="text-gray-300 leading-relaxed">{message.content}</p>
      </div>

      {/* Footer with metadata */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-800 group-hover:border-gray-700 transition-all">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(message.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageCard;
