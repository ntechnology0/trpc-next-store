import { TRPCError } from "@trpc/server";
import database from "@db/index";
import { captureException } from "@sentry/nextjs";

const useAccount = async (email: string) => {
  try {
    return await database?.user.findUnique({
      where: { email: email },
      include: {
        organizations: {
          include: {
            country: true,
          },
        },
      },
    });
  } catch (error) {
    captureException(error);
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "ACCOUNT_OBJECT_NOT_FOUND",
    });
  }
};

export default useAccount;
