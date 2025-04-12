import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 overflow-x-hidden w-full">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-r-gray-800 border-b-indigo-700 border-l-gray-800 animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium">Loading session...</p>
      </div>
    </div>
  );
};

export default Loader;
