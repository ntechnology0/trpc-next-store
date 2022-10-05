import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authenticationOptions } from "pages/api/auth/[...nextauth]";

export const requireAuthentication =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authenticationOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: "/account/login",
          permanent: false,
        },
      };
    }
    return await func(ctx);
  };
