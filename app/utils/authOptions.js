import { cookies } from "next/headers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { rawFetch } from "../lib/fetcher/rawFetch";

const refreshAccessToken = async (token) => {
  try {
    const result = await rawFetch("/refresh-token", {
      method: "POST",
      headers: { Cookie: cookies().toString() },
    });

    if (!result.ok)
      throw new Error(result.message || "Failed to refresh access token.");

    const newAccessToken = result.data.accessToken;

    if (!newAccessToken)
      throw new Error("Failed to generate new access token.");

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      error: undefined,
    };
  } catch (error) {
    console.error(
      `RefreshTokenError (authOptions/refreshAccessToken): ${error.message || "Failed to refresh access token."}`,
    );
    throw new Error(error.message);
  }
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const result = await rawFetch("/verify-credentials-login", {
            method: "POST",
            body: JSON.stringify(credentials),
          });

          if (!result.ok)
            throw new Error(
              result.message || "Invalid credentials. Please try again.",
            );

          return {
            email: credentials.email,
          };
        } catch (error) {
          console.error(
            `VerifyError (authOptions/authorize): ${error.message || "Failed to verify login credentials."}`,
          );
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        try {
          const result = await rawFetch("/verify-google-login", {
            method: "POST",
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
            }),
          });

          if (!result.ok)
            throw new Error(
              result.message || "Failed to authenticate with Google.",
            );

          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          };
        } catch (error) {
          console.error(
            `VerifyError (authOptions/profile): ${error.message || "Failed to authenticate with Google."}`,
          );
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        try {
          const result = await rawFetch("/generate-customer-tokens", {
            method: "POST",
            body: JSON.stringify({ email: user.email }),
          });

          if (!result.ok)
            throw new Error(
              result.message || "Failed to generate customer tokens.",
            );

          const userData = result.data;

          cookies().set("refreshToken", userData.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          token._id = userData._id;
          token.email = userData.email;
          token.name = userData.name;
          token.isLinkedWithCredentials = userData.isLinkedWithCredentials;
          token.isLinkedWithGoogle = userData.isLinkedWithGoogle;
          token.score = userData.score;
          token.accessToken = userData.accessToken;
          token.accessTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

          return token;
        } catch (error) {
          console.error(
            `TokenError (authOptions/callbacks/jwt): ${error.message || "Failed to generate customer tokens."}`,
          );
          throw new Error(error.message);
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.isLinkedWithCredentials = token.isLinkedWithCredentials;
      session.user.isLinkedWithGoogle = token.isLinkedWithGoogle;
      session.user.score = token.score;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
