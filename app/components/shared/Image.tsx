import React from "react";
import Image from "next/image";
import clsx from "clsx";
import signedPicture from "@app/utility/supabase/image";

type Props = {
  url: string;
  alt: string;
  width: number;
  height: number;
  fetching?: boolean;
  className?: string;
};
const LoaderImage: React.FC<Props> = ({
  url,
  alt,
  width,
  height,
  className,
  fetching = false,
}) => {
  const [loading, setLoading] = React.useState(true);
  const [fetchedSignedURL, setFetchSignedURL] = React.useState("");

  React.useEffect(() => {
    const fetch = async () => {
      const signedURL = await signedPicture(url);
      setFetchSignedURL(signedURL!);
    };
    fetch();
  }, [url]);

  return (
    <div
      className={`aspect-w-1 aspect-h-1 w-full flex-1 bg-transparent overflow-hidden rounded xl:aspect-w-7 xl:aspect-h-8 ${className}`}
    >
      {fetchedSignedURL && fetchedSignedURL.length > 0 ? (
        <Image
          alt={alt}
          src={fetchedSignedURL}
          width={width}
          height={height}
          objectFit="cover"
          className={clsx(
            "duration-700 ease-in-out group-hover:opacity-75",
            loading || fetching
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      ) : (
        <div
          style={{ width, height }}
          className="flex flex-col justify-center items-center bg-slate-50"
        >
          <span className="text-xs font-medium fonts__inter_regular">
            Envoi en cours
          </span>
        </div>
      )}
    </div>
  );
};

export default LoaderImage;
