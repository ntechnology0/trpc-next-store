import nextAuth, { NextAuthOptions } from "next-auth";
import emailProvider from "next-auth/providers/email";
import credentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import database from "@db/index";
import { authenticationSchema } from "@server/common/validation/authentication";
import { sendVerificationRequest } from "@app/utility/mail/transporter";
import { verify } from "argon2";

export const authenticationOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    newUser: "/account/register",
  },
  providers: [
    credentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(_credentials, _request) {
        const credentials = await authenticationSchema.parseAsync(_credentials);
        const account = await database?.user.findUnique({
          where: { email: credentials.email },
          include: {
            organizations: {
              include: {
                country: true,
              },
            },
          },
        });
        if (!account) {
          return null;
        }
        const validPassword = await verify(
          account.password,
          credentials.password
        );
        if (!validPassword) {
          return null;
        }
        return {
          id: account.id,
          email: account.email,
          username: account.password,
        };
      },
    }),
    // --- left this option in case a future change
    emailProvider({
      server: process.env.POSTMARK_SMTP_SERVER,
      from: process.env.POSTMARK_SMTP_FROM,
      maxAge: 10 * 60, // 10 minutes validity only for magic links,
      sendVerificationRequest: sendVerificationRequest,
    }),
  ],
  callbacks: {
    // -- If the account exists and allowed to signIn.
    async signIn({ user }) {
      if (!user || !user.email) return false;
      const doAccountExist = await database?.user.findUnique({
        where: { email: user.email! },
      });
      return doAccountExist ? true : false;
    },
    // -- change JWT token fields id, email
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
    // -- retrieve session with custom fields
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60,
  },
  session: {
    strategy: "jwt", // --- database not supported by credentials
    maxAge: 15 * 24 * 30 * 60,
  },
  debug: process.env.NODE_ENV === "production" ? false : true,
  adapter: PrismaAdapter(database!),
  secret: process.env.NEXTAUTH_SECRET,
};
export default nextAuth(authenticationOptions);
