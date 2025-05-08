import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./lib/db";
import { User } from "./lib/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user: { name, email, image }, profile }) {
      await connectDB();
      const googleId = profile?.sub;
      const existingUser = await User.findOne({ googleId });
      if (!existingUser) {
        await User.create({
          googleId,
          name,
          email,
          image,
        });
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (profile && account) {
        await connectDB();
        const user = await User.findOne({ googleId: profile.sub });
        if (user) {
          token.id = user._id.toString();
          token.name = user.name;
          token.email = user.email;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
        };
      }
      return session;
    },
  },
});
