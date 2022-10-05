import { queryHook } from "@app/hooks/queryHook";
import { Collection } from "@prisma/client";
import dynamic from "next/dynamic";
import React from "react";

const CollectionItem = dynamic(() => import("./CollectionItem"));
const Loader = dynamic(() => import("@app/components/shared/Loader"));

type Props = {
  filter: "available" | "archived";
};

const ListCollections: React.FC<Props> = ({ filter = "archived" }) => {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const { status, data: result } = queryHook.useQuery(
    ["collection.list", { limit: 10, status: filter, orderBy: "desc" }],
    { ssr: false }
  );

  React.useEffect(() => {
    if (result && result.collections && status === "success") {
      setCollections(result.collections);
    }
  }, [result, filter]);

  return (
    <div className="w-full flex flex-col justify-start items-center py-4">
      <ul className="min-w-full space-y-1 divide-y-1 divide-slate-500 flex flex-col justify-start items-center">
        <li className="w-full uppercase grid grid-cols-12 px-2">
          <div className="col-span-9 py-1 flex flex-row justify-start items-center">
            <span className="text-[0.7rem] font-semibold fonts__inter_regular text-black">
              Nom de la collection
            </span>
          </div>
          <div className="col-span-2 py-1 flex flex-row justify-start items-center">
            <span className="text-[0.7rem] font-semibold fonts__inter_regular text-black">
              Mis à jour le
            </span>
          </div>
          <div className="col-span-1"></div>
        </li>
        {status === "success" && collections ? (
          collections.map((collection) => (
            <CollectionItem
              key={`${collection.reference}_collection`}
              collection={collection}
            />
          ))
        ) : (
          <Loader width={5} height={5} showText={true} />
        )}
      </ul>
    </div>
  );
};

export default ListCollections;
