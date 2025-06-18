import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials-frontend",
      name: "Frontend Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `https://fc-backend-664306765395.asia-south1.run.app/customer-login`,
            credentials,
          );

          if (!data) {
            throw new Error("Invalid email/username or password"); // ❌ Prevent returning null
          }

          return {
            email: data?.email,
            name: data?.userInfo?.personalInfo?.customerName,
            score: data?.userInfo?.score,
          };
        } catch (error) {
          // Return specific error messages from backend if available
          throw new Error(
            error.response?.data?.message ||
              "Login failed! Please check your credentials.",
          );
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.email = user?.email;
        token.name = user?.name || profile?.name;
        token.score = user?.score;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.score = token.score;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
