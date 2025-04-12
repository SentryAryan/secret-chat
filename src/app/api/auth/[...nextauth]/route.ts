import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      isAcceptingMessages: boolean;
      name: string;
      email: string;
      image: string;
    };
  }
}
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // ! asserts it's defined
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET, // Use the secret from .env.local
  callbacks: {
    // This callback runs when a user successfully signs in
    async signIn({ user, account, profile }) {
      // Only proceed if it's a Google sign-in
      if (account?.provider === "google") {
        try {
          await dbConnect(); // Connect to the database

          // Check if the user already exists in your database
          const existingUser = await User.findOne({ googleId: profile?.sub });

          if (!existingUser) {
            // If user doesn't exist, create a new one
            await User.create({
              googleId: profile?.sub, // Google's unique user ID
              email: user.email,
              username: user.name,
              image: user.image,
            });
            console.log("New user created in DB:", user.email);
          } else {
            console.log("User already exists in DB:", user.email);
            // Optionally: update user info if needed (e.g., image change)
            // await User.updateOne({ googleId: profile.sub }, { image: user.image });
          }

          return true; // Allow the sign-in
        } catch (error) {
          console.error("Error during Google sign-in DB operation:", error);
          return false; // Prevent sign-in on error
        }
      }
      return false; // Disallow sign-in for other providers (if any were added)
    },
    async session({ session, token }) {
      // Attach additional user data to the session
      if (token.sub) {
        // Fetch the user from the database using the token.sub (user ID)
        await dbConnect();
        const user = await User.findOne({ googleId: token.sub });

        if (user) {
          // Add custom fields to the session
          session.user._id = user.id; // MongoDB _id
          session.user.isAcceptingMessages = user.isAcceptingMessages;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // Optional: Redirect users to /signin if auth required
  },
  session: {
    maxAge: 1 * 24 * 60 * 60, // 1 day
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
