import { captureException } from "@sentry/nextjs";
import { supabase } from "../supabase";

const signedPicture = async (key: string) => {
  try {
    const { data, error } = await supabase.storage
      .from("parawell-images")
      .download(key.replace("parawell-images/", ""));
    const signedURL = URL.createObjectURL(data as Blob);
    if (error) throw new Error(`${error.message}-${error.cause}`);
    return signedURL;
  } catch (error) {
    captureException(error);
  }
};

export default signedPicture;
