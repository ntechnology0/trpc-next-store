import { createContext } from "@server/context";
import { serverRouter } from "@server/router";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
  router: serverRouter,
  createContext,
});
