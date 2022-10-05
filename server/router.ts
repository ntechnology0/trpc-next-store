import { TRPCError, router } from "@trpc/server";
import { hash } from "argon2";
import { Context } from "./context";
import { registerSchema } from "@server/common/validation/authentication";
import { collectionRouter } from "./modules/collection/router";

export const serverRouter = router<Context>()
  .mutation("signup", {
    input: registerSchema,
    resolve: async ({ input, ctx }) => {
      const { username, email, password } = input;
      const doExist = await ctx.database!.user.findUnique({ where: { email } });

      if (doExist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "ACCOUNT_ALREADY_EXISTS",
        });
      }

      const hashedPassword = await hash(password);
      const result = await ctx.database!.user.create({
        data: {
          email: email,
          password: hashedPassword,
          username: username,
        },
      });

      return {
        status: 201,
        message: "ACCOUNT_CREATED_SUCCESSFULLY",
        result: result ? result.email : null,
      };
    },
  })
  .merge("collection.", collectionRouter);

export type ServerRouter = typeof serverRouter;
