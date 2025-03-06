import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials-backend",
      name: "Backend Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text", placeholder: "Enter OTP if received" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(`https://fashion-commerce-backend.vercel.app/loginForDashboard`, credentials);

          if (!data) {
            throw new Error("Invalid email/username or password"); // ❌ Prevent returning `null`
          };

          return {
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            dob: data.dob,
            fullName: data.fullName
          };

        } catch (error) {
          // Return specific error messages from backend if available
          throw new Error(error.response?.data?.message || "Login failed! Please check your credentials.");
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
          const { customerDetails } = await axios.post(`https://fashion-commerce-backend.vercel.app/customer-signup`, credentials);

          if (!customerDetails) {
            throw new Error("Invalid email/username or password"); // ❌ Prevent returning `null`
          };

          console.log(customerDetails, "customerDetails");


          return customerDetails;

        } catch (error) {
          // Return specific error messages from backend if available
          throw new Error(error.response?.data?.message || "Login failed! Please check your credentials.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.dob = user.dob;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      session.user.dob = token.dob;
      session.user.fullName = token.fullName;
      return session;
    },
  },
  // async signOut({ token }) {
  //   // Optional: Clean up any session or JWT token manually if needed
  //   return null;
  // },
  pages: { signIn: "/auth/restricted-access" },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};