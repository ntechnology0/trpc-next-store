import { requireAuthentication } from "@components/layouts/ProtectRoute";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { clsx } from "clsx";
import { useRouter } from "next/router";

const Layout = dynamic(() => import("@components/layouts/Layout"));

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return { props: {} };
});

const ProductsCreateStyled = styled.div``;

const ProductsCreate: NextPage = () => {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"available" | "archived">(
    "available"
  );
  const { data } = useSession();

  return (
    <Layout title="Parawell.ma | Ajouter un produit">
      <div className="w-screen flex min-h-screen flex-col justify-start items-center"></div>
    </Layout>
  );
};

export default ProductsCreate;
