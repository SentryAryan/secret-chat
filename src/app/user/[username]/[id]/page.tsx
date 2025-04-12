"use client";

import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, MessageSquare, Send, Sparkles, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

const SendMessagePage = () => {
  const { username, id } = useParams();
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [topic, setTopic] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode: "all",
  });

  const generateQuestions = async () => {
    try {
      setIsLoadingQuestions(true);
      setShowSuggestions(true);

      const response = await axios.get("/api/suggest");
      const questionsString = response.data.data.questions;
      const topicName = response.data.data.topic;

      const questionsArray = questionsString.split("||");

      setSuggestedQuestions(questionsArray);
      setTopic(topicName);
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    setValue("content", question, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/messages/create-message", {
        id,
        content: data.content,
      });
      toast.success(response.data.message);
      reset();
      // Reset suggestions after submission
      setSuggestedQuestions([]);
      setShowSuggestions(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4 sm:p-6">
      {/* Header with app branding */}
      <div className="w-full max-w-xl flex justify-center mb-6">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
            <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            Secret-Chat
          </h1>
        </Link>
      </div>

      <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-indigo-900/10 p-6 md:p-8 space-y-6 backdrop-blur-sm bg-opacity-90">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center bg-indigo-600/20 p-2 rounded-full mb-2">
            <User className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Send Anonymous Message
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-400">to</span>
            <span className="text-indigo-400 font-medium bg-indigo-900/30 px-3 py-1 rounded-full text-sm">
              {username}
            </span>
          </div>
        </div>

        <button
          onClick={generateQuestions}
          disabled={isLoadingQuestions}
          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600 shadow-md hover:shadow-xl hover:shadow-black/10 transform hover:translate-y-[-1px] cursor-pointer"
        >
          {isLoadingQuestions ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-indigo-400" />
          )}
          <span>
            {isLoadingQuestions
              ? "Generating Ideas..."
              : "Generate Message Ideas"}
          </span>
        </button>

        {/* Suggestions Section */}
        {showSuggestions && (
          <div className="space-y-3">
            {topic && (
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                <span>
                  Ideas about <span className="text-indigo-400">{topic}</span>
                </span>
              </h2>
            )}

            {isLoadingQuestions ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-all duration-200 cursor-pointer border border-gray-700 hover:border-indigo-900/50 hover:shadow-md"
                    onClick={() => handleSelectQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 w-full"
        >
          <div className="w-full relative">
            <textarea
              {...register("content")}
              className="w-full min-h-[180px] bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-4 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
              placeholder="Type your message here..."
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#4f46e5 #1f2937",
              }}
            />
            {errors.content && (
              <div className="absolute -bottom-6 left-0 right-0 text-red-500 text-center text-sm bg-red-500/10 py-1 px-2 rounded-md backdrop-blur-sm">
                {errors.content.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 w-full sm:w-auto cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30 transform hover:translate-y-[-1px]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-gray-500 text-xs flex flex-col gap-2">
        {status === "unauthenticated" ? (
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 w-full sm:w-auto cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30 transform hover:translate-y-[-1px] text-center text-[14px]"
            onClick={() =>
              router.push(`/signin?callbackUrl=/user/${username}/${id}`)
            }
          >
            <span>Get your own </span>
            <FontAwesomeIcon
              icon={faLock}
              className="w-5 h-5 text-white inline-block"
            />
            <span>Secret-Chat dashboard</span>
          </button>
        ) : null}

        <p>All messages are anonymous and encrypted end-to-end</p>
      </div>
    </div>
  );
};

export default SendMessagePage;
