import { useRouter } from "next/router";
import React from "react";
import clsx from "clsx";

type Props = { title?: string; href: string };

const MenuLink: React.FC<Props> = ({ title, href }) => {
  const router = useRouter();

  return (
    <button
      type="button"
      className={clsx(
        "focus:outline-none pb-0.5 px-3",
        href === router.pathname && "bg-primary rounded-full",
        href !== router.pathname && "hover:bg-slate-100 rounded-full"
      )}
      onClick={() => {
        router.push(href);
      }}
    >
      <span
        className={clsx(
          "text-black fonts__inter_regular text-[0.78rem] -mt-2 font-medium",
          router.pathname === href && "text-white"
        )}
      >
        {title}
      </span>
    </button>
  );
};

export default MenuLink;
