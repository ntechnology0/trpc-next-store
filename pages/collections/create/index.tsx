import { requireAuthentication } from "@components/layouts/ProtectRoute";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { captureException } from "@sentry/nextjs";
import { Form, Formik, Field } from "formik";
import { useRouter } from "next/router";
import { FiChevronLeft, FiUpload } from "react-icons/fi";
import { queryHook } from "@app/hooks/queryHook";
import { createHash } from "crypto";

const Layout = dynamic(() => import("@components/layouts/Layout"));
const Button = dynamic(() => import("@components/shared/Button"));
const Image = dynamic(() => import("@components/shared/Image"));

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return { props: {} };
});

const CollectionsCreateStyled = styled.div``;

const CollectionsCreate: NextPage = () => {
  const router = useRouter();
  const { data } = useSession();
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [previewKey, setPreviewKey] = React.useState("");

  const onSubmit = async (v: { name: string; description: string }) => {
    try {
      const { mutateAsync: createCollection, isLoading } =
        queryHook.useMutation(["collection.create"]);

      if (previewKey.length <= 0) {
        throw new Error("UPLOAD_NOT_VALID");
      }
      const result = await createCollection({
        picture: previewKey,
        name: v.name,
        description: v.description,
      });
      if (result) router.push("/collections");
    } catch (error) {
      captureException(error);
    }
  };

  const onCollectionImage = async () => {
    fileInput.current?.click();
  };

  const onCollectionMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e?.target.files && e.target.files.length > 0) {
        const supabase = (await import("@app/utility/supabase")).supabase;

        setUploading(true);
        const file = e?.target?.files![0];
        const fileName = `${data?.id}_${createHash("sha256")
          .update(file.name + new Date().getTime())
          .digest("hex")
          .toLocaleLowerCase()}.${file.name.split(".").pop()}`;
        const { data: uploadResult, error } = await supabase.storage
          .from("parawell-images")
          .upload(`private/${fileName}`, file as File);
        if (file.size > 5e7) throw new Error("UPLOAD_SIZE_TOO_LARGE");
        if (error) {
          throw new Error("UPLOAD_FAILED");
        }
        if (uploadResult?.Key) {
          setPreviewKey(uploadResult.Key);
          setUploading(false);
        }
      }
    } catch (error) {
      setUploading(false);
      captureException(error);
    }
  };

  return (
    <Layout title="Parawell.ma | Ajouter un produit">
      <input
        type="file"
        className="hidden"
        ref={fileInput}
        onChange={onCollectionMedia}
      />
      <CollectionsCreateStyled className="w-screen flex min-h-screen flex-col justify-start items-center">
        <Formik
          initialValues={{ name: "", description: "" }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <Form className="flex flex-col justify-start items-center">
              <div className="w-screen flex flex-col justify-center items-center border-b border-slate-100">
                <div className="container flex flex-row justify-between items-center py-2.5">
                  <div className="flex flex-row justify-start items-center space-x-2">
                    <Button
                      type="neutral"
                      className="p-0"
                      onClick={() => router.push("/collections")}
                    >
                      <FiChevronLeft color="#000" size={14} strokeWidth={3} />
                    </Button>
                    <h2 className="text-sm fonts__inter_regular font-medium">
                      Créer une collection
                    </h2>
                  </div>
                  <div className="flex flex-row justify-start items-center space-x-2">
                    <Button
                      type="neutral"
                      onClick={() => router.push("/collections")}
                    >
                      <span className="text-xs font-medium text-black fonts__inter_regular">
                        Annuler
                      </span>
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      isSubmit={true}
                      className={`${uploading && "opacity-40"}`}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <span className="text-xs font-medium fonts__inter_regular">
                          En cours
                        </span>
                      ) : (
                        <span className="text-xs font-medium fonts__inter_regular">
                          Enregistrer
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-full lg:max-w-[500px] space-x-0 lg:space-x-5 flex flex-col lg:flex-row justify-start pt-10 items-start">
                <div className="w-full lg:w-3/4 flex flex-col justify-start space-y-1.5 items-start">
                  <h4 className="text-sm fonts__poppins_regular font-medium">
                    Information de la collection
                  </h4>
                  <div className="w-full max-w-[320px] flex flex-col justify-start items-start space-y-2">
                    <div className="rounded-md border w-full border-gray-300 px-3 py-2 shadow-sm focus-within:border-[#0389FF] focus-within:ring-1 focus-within:ring-[#0389FF]">
                      <label
                        htmlFor="name"
                        className="block text-xs fonts__inter_regular font-medium text-gray-900"
                      >
                        Nom de la collection
                      </label>
                      <Field
                        type={"text"}
                        autoComplete={"off"}
                        autoCapitalize={"none"}
                        name="name"
                        id="name"
                        className="block w-full border-0 pt-1 text-xs p-0 fonts__inter_regular text-gray-900 placeholder-gray-500 focus:ring-0"
                        placeholder="Bébé, Soins du visage, etc."
                      />
                    </div>
                    <div className="rounded-md border w-full border-gray-300 px-3 py-2 shadow-sm focus-within:border-[#0389FF] focus-within:ring-1 focus-within:ring-[#0389FF]">
                      <label
                        htmlFor="description"
                        className="block text-xs fonts__inter_regular font-medium text-gray-900"
                      >
                        Description de la collection
                      </label>
                      <Field
                        type={"text"}
                        as={"textarea"}
                        autoComplete={"off"}
                        autoCapitalize={"none"}
                        name="description"
                        id="description"
                        className="block resize-none h-[100px] pt-1 w-full border-0 text-xs p-0 fonts__inter_regular text-gray-900 placeholder-gray-500 focus:ring-0"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/4 flex pt-6 flex-col justify-start items-start">
                  <button
                    type="button"
                    disabled={uploading}
                    className={`focus:outline-none w-[160px] h-[160px] flex flex-col justify-center items-center rounded ${
                      previewKey.length === 0 && "border"
                    } border-dashed border-slate-400 hover:bg-slate-50`}
                    onClick={onCollectionImage}
                  >
                    {previewKey && previewKey.length > 0 ? (
                      <Image
                        url={previewKey}
                        alt="Preview of collection"
                        width={160}
                        height={160}
                      />
                    ) : (
                      <div className="flex flex-row justify-center items-center space-x-2">
                        <FiUpload size={15} className="text-primary" />
                        <span className="fonts__inter_regular text-xs text-slate-600 font-semibold">
                          Envoyer
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </CollectionsCreateStyled>
    </Layout>
  );
};

export default CollectionsCreate;
