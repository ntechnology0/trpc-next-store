import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";

const MenuLink = dynamic(() => import("@components/shared/MenuLink"));

const Menu: React.FC = () => {
  return (
    <div className="w-screen flex flex-row justify-center items-center py-2 border-b border-slate-100">
      <div className="container flex flex-row justify-start items-center space-x-1">
        <Link href={"/dashboard"}>
          <MenuLink title="Tableau de bord" href="/dashboard" />
        </Link>
        <Link href={"/products"}>
          <MenuLink title="Produits" href="/products" />
        </Link>
        <Link href={"/collections"}>
          <MenuLink title="Collections" href="/collections" />
        </Link>
      </div>
    </div>
  );
};

export default Menu;
