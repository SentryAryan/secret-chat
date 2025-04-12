"use client";

import { faGoogle as fabGoogle } from "@fortawesome/free-brands-svg-icons";
import { faClock, faLock, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const isUnAuthorized = useSelector((state: any) => state.unAuthorized);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 overflow-x-hidden w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-r-gray-800 border-b-indigo-700 border-l-gray-800 animate-spin"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  // Show sign-in page if not authenticated
  if (status === "unauthenticated" || isUnAuthorized) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-950 w-full">
        {/* Left side - Branding */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-gradient-to-br from-gray-900 to-black">
          <div className="max-w-md w-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 rounded-lg shadow-lg">
                <FontAwesomeIcon icon={faLock} className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Secret-Chat</h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl mb-8">
              Secure. Private. Encrypted.
            </p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-indigo-600/20 p-2 rounded-full mr-4">
                  <FontAwesomeIcon icon={faLock} className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-gray-300">End-to-end encryption</p>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-600/20 p-2 rounded-full mr-4">
                  <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-gray-300">Private group chats</p>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-600/20 p-2 rounded-full mr-4">
                  <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-gray-300">Self-destructing messages</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Sign in form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-16">
          <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl shadow-indigo-900/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue to Secret-Chat</p>
            </div>
            
            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-[1.02] cursor-pointer"
            >
              <FontAwesomeIcon icon={fabGoogle} className="w-5 h-5" />
              Sign in with Google
            </button>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                By signing in, you agree to our 
                <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 ml-1">
                  Terms of Service
                </Link>
                {" and "}
                <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 overflow-x-hidden w-full">
      <div className="animate-pulse flex flex-col items-center">
        <p className="text-gray-400 font-medium">
          Please refresh the page
        </p>
      </div>
    </div>
  );
}
