import React from "react";
import Head from "next/head";
import Script from "next/script";

type Props = {
  children?: React.ReactNode;
  title?: string;
};

const Layout: React.FC<Props> = ({ children, title }) => {
  return (
    <main className="w-screen absolute top-0 bg-transparent z-30">
      <Head>
        <title>
          {title || "Parawell.ma - Parapharmacie en ligne by Sahti.ma"}
        </title>
        <meta
          property="og:title"
          content={title || "Parawell.ma - Parapharmacie en ligne by Sahti.ma"}
          key="title"
        />
        <meta
          name="description"
          content="Avec parawell.ma bénéficiez d'une livraison partout au Maroc."
        />
        <meta
          property="og:description"
          content="Avec parawell.ma bénéficiez d'une livraison partout au Maroc."
        />
        <meta
          property="og:title"
          content="Parawell.ma - Parapharmacie en ligne by Sahti.ma"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://parawell.ma" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      {children}
    </main>
  );
};

export default Layout;
