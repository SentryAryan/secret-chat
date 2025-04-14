import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  const { data: session, status } = useSession();
  console.log(session?.user);
  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center py-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
            <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text  group-hover:from-indigo-300 group-hover:to-indigo-500 transition-all duration-300">
            Secret-Chat
          </h1>
        </Link>

        {status === "authenticated" ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={session?.user?.image || "/default-user.png"}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-indigo-600 shadow-md hover:border-indigo-400 transition-all duration-300"
                />
                <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-300 border border-gray-700 hover:border-gray-600 text-sm hover:shadow-lg hover:shadow-gray-900/50 transform hover:translate-y-[-1px]"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => signIn("google")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md cursor-pointer transition-all duration-300 shadow-lg shadow-indigo-900/20 text-sm font-medium hover:shadow-indigo-900/30 transform hover:translate-y-[-1px]"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
