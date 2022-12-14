import { requireAuthentication } from "@components/layouts/ProtectRoute";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/router";
import clsx from "clsx";

const Header = dynamic(() => import("@components/shared/Header"));
const MenuItem = dynamic(() => import("@app/components/shared/MenuItem"));
const Menu = dynamic(() => import("@app/components/shared/Menu"));
const Button = dynamic(() => import("@components/shared/Button"));
const Layout = dynamic(() => import("@components/layouts/Layout"));

const ListOfCollections = dynamic(
  () => import("@components/collections/ListCollections")
);

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return { props: {} };
});

const CollectionsStyled = styled.div``;

const Collections: NextPage = () => {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"available" | "archived">(
    "available"
  );

  return (
    <Layout title="Parawell.ma | Panneau administrateur">
      <div className="w-screen flex min-h-screen flex-col justify-start items-center">
        <Header />
        <Menu />
        <CollectionsStyled className="container height__row flex flex-row justify-start items-start space-x-0 lg:space-x-4 py-2">
          <div className="w-full lg:w-[160px] flex flex-col justify-start items-start"></div>
          <div className="w-full flex flex-col justify-start items-start py-2">
            <div className="w-full flex flex-row justify-between items-center">
              <h1 className="font-semibold fonts__inter_regular text-lg">
                Collections
              </h1>
              <div className="flex flex-row justify-between items-center">
                <Button
                  type="primary"
                  className="flex flex-row justify-start space-x-2 items-center"
                  onClick={() => router.push("/collections/create")}
                >
                  <FiPlus size={15} color={"#FFF"} strokeWidth={3} />
                  <span className="fonts__inter_regular text-xs font-medium">
                    Ajouter une collection
                  </span>
                </Button>
              </div>
            </div>
            <div className="w-full flex flex-col border-b border-slate-100 py-[0.32rem] justify-start items-start">
              <div className="w-full flex flex-row justify-start items-center space-x-5">
                <MenuItem
                  text="Disponible(s)"
                  className={clsx(
                    "text-slate-400",
                    filter === "available" && "text-primary"
                  )}
                  isActive={filter === "available"}
                  color="bg-primary"
                  onClick={() => setFilter("available")}
                  noMenu
                />
                <MenuItem
                  text="Archiv??(s)"
                  className={clsx(
                    "text-slate-400",
                    filter === "archived" && "text-primary"
                  )}
                  isActive={filter === "archived"}
                  color="bg-primary"
                  onClick={() => setFilter("archived")}
                  noMenu
                />
              </div>
            </div>
            <ListOfCollections filter={filter} />
          </div>
        </CollectionsStyled>
      </div>
    </Layout>
  );
};

export default Collections;
