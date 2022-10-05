import { Collection } from "@prisma/client";
import dynamic from "next/dynamic";
import React from "react";
import moment from "moment";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Button = dynamic(() => import("@components/shared/Button"));
const Badge = dynamic(() => import("@components/shared/Badge"));

type Props = {
  collection: Collection;
};

const statusCheck = (s: string) => {
  switch (s) {
    case "archived":
      return "Archivé";
    case "available":
      return "Active";
    default:
      return "Active";
  }
};

const CollectionItem: React.FC<Props> = ({ collection }) => {
  return (
    <div className="min-w-full grid grid-cols-12 hover:bg-slate-50 cursor-pointer px-2 rounded py-0.5">
      <div className="col-span-9 flex flex-col justify-start items-start whitespace-nowrap font-medium fonts__iinter_regular text-xs text-black">
        <div className="flex flex-row justify-start items-center space-x-1">
          <span>{collection.name}</span>
        </div>
        <div className="w-full flex flex-row justify-start text-primary items-center text-[0.7rem]">
          <span>{"0"} produits</span>
          <Badge
            text={statusCheck(collection.status)}
            color={"bg-transparent"}
            textColor={"text-primary"}
            withDot={true}
            badgeColor={"text-primary"}
          />
        </div>
      </div>
      <div className="col-span-2 flex flex-col space-y-0.5 justify-center items-start">
        <span className="text-xs text-slate-500 fonts__inter_regular">
          {moment(collection.updatedAt).utc().format("dddd DD MMM YYYY")}
        </span>
        <span className="text-xs text-slate-500 fonts__inter_regular">
          {moment(collection.updatedAt).utc().format("hh:mm A")}
        </span>
      </div>
      <div className="col-span-1 flex flex-col justify-center items-center">
        <Button type="neutral" className="h-4">
          <HiOutlineDotsHorizontal size={15} className="text-primary" />
        </Button>
      </div>
    </div>
  );
};

export default CollectionItem;
