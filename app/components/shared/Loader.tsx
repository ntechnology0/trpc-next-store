import React from "react";

type Props = {
  width: number;
  height: number;
  showText?: boolean;
  className?: string;
};

const Loader: React.FC<Props> = ({
  width,
  height,
  showText = false,
  className,
}) => {
  return (
    <div className="flex flex-row justify-start items-center space-x-2">
      <div
        style={{ width, height }}
        className="flex flex-col justify-center items-center"
      >
        <span className="animate-ping inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      </div>
      {showText === true && (
        <span
          className={`fonts__inter_regular font-medium text-black ${className} text-xs`}
        >
          Chargement
        </span>
      )}
    </div>
  );
};

export default Loader;
