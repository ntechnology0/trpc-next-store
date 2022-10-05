import "@styles/index.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { NextComponentType } from "next";
import { withTRPC } from "@trpc/next";
import { Session } from "next-auth";
import PlausibleProvider from "next-plausible";
import { ServerRouter } from "@server/router";
import { Toaster } from "react-hot-toast";

type NOKTAPropsType = AppProps<{
  session: Session;
  Component: NextComponentType;
}>;

function NOKTA({ Component, pageProps: { ...pageProps } }: NOKTAPropsType) {
  return (
    <PlausibleProvider
      domain="parawell.ma"
      trackLocalhost
      trackFileDownloads
      trackOutboundLinks
    >
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster />
    </PlausibleProvider>
  );
}

export default withTRPC<ServerRouter>({
  config({}) {
    const url =
      process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production"
        ? `https://${process.env.NEXTAUTH_URL}/api`
        : "http://localhost:3000/api";

    return {
      url,
      headers: {
        "x-ssr": "1",
      },
    };
  },
  ssr: true,
})(NOKTA);
