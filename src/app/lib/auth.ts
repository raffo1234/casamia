// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "./supabase";
import syncUserWithDatabase from "./syncUserWithDatabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user && account?.provider === "google" && profile) {
        await syncUserWithDatabase(user, profile);
      } else if (user && account?.provider === "credentials") {
        console.log("Credentials sign-in successful for user:", user);
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.user_id) {
        try {
          const { data: dbUser, error } = await supabase
            .from("user")
            .select("id, role_id")
            .eq("email", token.email)
            .single();

          if (error) {
            console.error("Error fetching user role in JWT callback:", error);
          } else if (dbUser?.id) {
            token.user_id = dbUser.id;
          }
        } catch (error) {
          console.error("Error fetching user role in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user_id) {
        session.user.id = token.user_id as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
});
