"use client"; // This component uses client-side hooks

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Provides session context to the rest of your app
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
