"use client"; // Need client component for useSession

import Loader from "@/components/Loader";
import MessageCard from "@/components/message-card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import {
  ClipboardCopy,
  Lock,
  Mail,
  MessageSquare,
  RefreshCw,
  Settings,
  Share2,
  UserCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import NavBar from "../components/nav-bar";
import { setIsRefreshing } from "../redux/slices/is-refreshing";
import { setMessages } from "../redux/slices/messages-slice";
import { setUnAuthorized } from "../redux/slices/unAuthorized-slice";

export default function HomePage() {
  console.log("HomePage");
  const router = useRouter();
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error("You are not signed in, maybe because session expired");
      router.push("/signin");
    },
  });
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
  const [isAccpetingMessages, setIsAccpetingMessages] = useState(
    session?.user?.isAcceptingMessages
  );
  const dispatch = useDispatch();
  const messages = useSelector((state: any) => state.messages.messages);
  const [isCopied, setIsCopied] = useState(false);
  const isRefreshing = useSelector((state: any) => state.isRefreshing);

  useEffect(() => {
    setIsAccpetingMessages(session?.user?.isAcceptingMessages);
  }, [session]);

  const fetchMessages = useCallback(async () => {
    try {
      dispatch(setIsRefreshing(true));
      const response = await axios.get("/api/messages/get-messages");
      dispatch(setMessages(response.data.data));
      toast.success("Messages refreshed");
    } catch (error: any) {
      console.log(error.response.data?.message);
      toast.error(error.response.data?.message || "Failed to refresh messages");
      if (error.response.data?.statusCode === 401) {
        toast.error("You are not signed in, maybe because session expired");
        router.push("/signin");
        dispatch(setUnAuthorized(true));
      }
    } finally {
      dispatch(setIsRefreshing(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMessages(); // Run on mount
    const handleFocus = () => fetchMessages();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const toggleAcceptMessages = async () => {
    try {
      const response = await axios.patch("/api/messages/toggleAccept", {
        isAcceptingMessages: !isAccpetingMessages,
      });
      if (response.data.statusCode === 200) {
        setIsAccpetingMessages(!isAccpetingMessages);
        toast.success(
          `${
            !isAccpetingMessages
              ? "You are now accepting messages"
              : "You are now not accepting messages"
          }`
        );
      }
    } catch (error: any) {
      console.log(error.response.data?.message);
      toast.error(
        error.response.data?.message || "Failed to toggle message acceptance"
      );
      if (error.response.data?.statusCode === 401) {
        toast.error("You are not signed in, maybe because session expired");
        router.push("/signin");
        dispatch(setUnAuthorized(true));
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${publicUrl}/user/${session?.user?.name.split(" ").join("-")}/${
        session?.user?._id
      }`
    );
    setIsCopied(true);
    toast.success("Link copied to clipboard");

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Show loading state
  if (status === "loading") {
    return <Loader />;
  }

  // This should theoretically not be reached if required: true is used,
  // but it's good practice for clarity.
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-xl shadow-black/20 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center bg-indigo-600/20 p-3 rounded-full mb-4">
            <Lock className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">Not Signed In</h2>
          <p className="text-gray-400 mb-6">
            You need to be signed in to access your dashboard.
          </p>
          <Link
            href="/signin"
            className="inline-block bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-indigo-900/20 transform hover:translate-y-[-1px]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Display user info if authenticated
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 w-full">
      <NavBar />

      <main className="flex-1 w-full py-8">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl shadow-xl shadow-black/20 p-6 mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-lg shadow-md">
                <UserCircle className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome, {session.user?.name}
                </h1>
                <p className="text-gray-400">
                  Manage your messages and profile settings
                </p>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl shadow-xl shadow-black/20 p-6 mb-8 transform hover:translate-y-[-2px] transition-all duration-300">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-indigo-400" />
              Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Message acceptance toggle */}
              <div className="flex items-center justify-between p-5 bg-gray-800/90 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 hover:border-gray-600 shadow-md">
                <div>
                  <Label
                    htmlFor="isAcceptingMessages"
                    className="text-sm font-medium text-gray-200"
                  >
                    Accept Messages
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    {isAccpetingMessages
                      ? "You are currently receiving messages"
                      : "You are not receiving messages"}
                  </p>
                </div>
                <Switch
                  id="isAcceptingMessages"
                  checked={isAccpetingMessages}
                  onCheckedChange={toggleAcceptMessages}
                  className="cursor-pointer"
                />
              </div>

              {/* Public link section */}
              <div className="space-y-3 bg-gray-800/90 p-5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all shadow-md">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                  Your Public Link
                </h3>
                <div className="relative group">
                  <input
                    type="text"
                    value={`${publicUrl}/user/${session.user?.name
                      .split(" ")
                      .join("-")}/${session.user?._id}`}
                    readOnly
                    className="w-full p-3 pr-10 border border-gray-700 rounded-lg bg-gray-700/50 text-sm text-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 p-1.5 rounded-md transition-colors bg-gray-700/70 group-hover:bg-gray-700 cursor-pointer"
                    aria-label="Copy to clipboard cursor-pointer"
                  >
                    {isCopied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <ClipboardCopy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 cursor-pointer transform hover:translate-y-[-1px]"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{isCopied ? "Copied!" : "Share Your Link"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages Header */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl shadow-xl shadow-black/20 p-6 mb-8 transform hover:translate-y-[-2px] transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-indigo-400" />
                  Your Messages
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {messages.length === 0
                    ? "You haven't received any messages yet."
                    : `You have received ${messages.length} message${
                        messages.length === 1 ? "" : "s"
                      }.`}
                </p>
              </div>

              <button
                onClick={fetchMessages}
                disabled={isRefreshing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isRefreshing
                    ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md shadow-indigo-900/20 transform hover:translate-y-[-1px]"
                } cursor-pointer`}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Messages Grid */}
          {messages.length === 0 ? (
            <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:bg-gray-800/80 transition-colors transform hover:translate-y-[-2px] duration-300 shadow-xl shadow-black/20">
              <div className="bg-indigo-600/20 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-gray-300 font-medium mb-2 text-lg">
                No Messages Yet
              </h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                Share your link with friends to start receiving anonymous
                messages.
              </p>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 px-5 rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 cursor-pointer transform hover:translate-y-[-1px] text-sm font-medium"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Your Link</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {messages.map((message: IMessage) => (
                <MessageCard
                  key={message._id.toString()}
                  message={message}
                  fetchMessages={fetchMessages}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-gray-500 text-xs mt-12">
        <div className="container mx-auto">
          <p>
            Secret-Chat © {new Date().getFullYear()} — End-to-end encrypted
            messaging
          </p>
        </div>
      </footer>
    </div>
  );
}
