import trpc from "@trpc/server";
import trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import database from "@db/index";
import { authenticationOptions } from "pages/api/auth/[...nextauth]";

export async function createContext(
  _context: trpcNext.CreateNextContextOptions
) {
  const { req, res } = _context;
  const session = await unstable_getServerSession(
    req,
    res,
    authenticationOptions
  );

  return {
    req,
    res,
    session,
    database,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
