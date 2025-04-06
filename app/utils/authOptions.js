import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials-backend",
      name: "Backend Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        otp: {
          label: "OTP",
          type: "text",
          placeholder: "Enter OTP if received",
        },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `https://fashion-commerce-backend.vercel.app/loginForDashboard`,
            credentials,
          );

          if (!data) {
            throw new Error("Invalid email/username or password"); // ❌ Prevent returning null
          }

          return {
            _id: data._id,
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
            `https://fashion-commerce-backend.vercel.app/customer-login`,
            credentials,
          );

          if (!data) {
            throw new Error("Invalid email/username or password"); // ❌ Prevent returning null
          }

          return {
            email: data?.email,
            name: data?.userInfo?.personalInfo?.customerName,
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
        token._id = user?._id;
        token.email = user?.email;
        token.name = user?.name || profile?.name;
      }

      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  pages: { signIn: "/auth/restricted-access" },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
