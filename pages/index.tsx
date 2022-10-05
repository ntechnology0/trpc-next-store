import Button from "@components/shared/Button";
import Guides from "@components/layouts/Guides";
import Layout from "@components/layouts/Layout";
import { signIn } from "next-auth/react";
import { Field, Formik, Form, FormikProps } from "formik";
import z, { object, string } from "zod";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import styled from "styled-components";
import { captureException } from "@sentry/nextjs";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { router } from "@trpc/server";

const LoginStyled = styled.div`
  .skew {
    height: 600px;
    &__bg {
      height: 600px;
      top: 0px;
    }
  }
  .form-box {
    padding: 30px 30px 30px;
  }
`;

const LoginValidationSchema = object({
  email: string().email(),
  password: string().min(12),
});

type LoginFormType = z.infer<typeof LoginValidationSchema>;

const Login: NextPage = () => {
  const { query, push } = useRouter();
  const initialValues: LoginFormType = { email: "", password: "" };
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = async (v: LoginFormType) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/dashboard",
        ...v,
      });
      if (result && result.error) {
        throw new Error(result.error);
      }
      push("/dashboard");
    } catch (error) {
      toast.error(
        <span className="text-xs fonts__inter_regular">
          Une erreur est survenue veuillez réessayer plus tard.
        </span>
      );
      captureException(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginStyled className="flex flex-col justify-start items-start min-h-screen">
      <Guides />
      <Layout>
        <div className="w-screen flex min-h-screen flex-col justify-center items-center space-y-32">
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ handleSubmit }: FormikProps<any>) => (
              <Form>
                <div className="w-full lg:max-w-[420px] mx-auto flex flex-col justify-center items-center">
                  <div className="bg-white w-full space-y-3 form-box shadow-lg border border-slate-500 rounded flex flex-col justify-start items-start">
                    <h1 className="font-medium fonts__poppins_regular text-sm font-sans">
                      Connectez-vous
                    </h1>
                    <div className="rounded-md border w-full border-gray-300 px-3 py-2 shadow-sm focus-within:border-[#0389FF] focus-within:ring-1 focus-within:ring-[#0389FF]">
                      <label
                        htmlFor="email"
                        className="block text-xs fonts__inter_regular font-medium text-gray-900"
                      >
                        E-mail
                      </label>
                      <Field
                        type={"email"}
                        autoComplete={"off"}
                        autoCapitalize={"none"}
                        name="email"
                        id="email"
                        className="block w-full border-0 text-sm p-0 fonts__inter_regular text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="sahti@provider.com"
                      />
                    </div>
                    <div className="rounded-md border w-full border-gray-300 px-3 py-2 shadow-sm focus-within:border-[#0389FF] focus-within:ring-1 focus-within:ring-[#0389FF]">
                      <label
                        htmlFor="password"
                        className="block text-xs fonts__inter_regular font-medium text-gray-900"
                      >
                        Mot de passe
                      </label>
                      <Field
                        type={"password"}
                        autoComplete={"off"}
                        autoCapitalize={"none"}
                        name="password"
                        id="password"
                        className="block w-full border-0 text-sm p-0 fonts__inter_regular text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Min. 12 caractères"
                      />
                    </div>
                    <Button
                      type="primary"
                      disabled={loading}
                      onClick={handleSubmit}
                      className={`w-full fonts__inter_regular flex text-sm font-medium flex-row justify-center items-center ${
                        loading && "opacity-40"
                      }`}
                    >
                      {loading ? <span>En cours</span> : <span>Continuer</span>}
                    </Button>
                    <p
                      className="mt-2 text-xs font__inter_regular text-gray-500"
                      id="email-description"
                    >
                      Nous utilisons un système de connexion sans mot de passe
                      avec des liens magiques. Vous serez recevoir un e-mail
                      pour confirmer votre connexion.
                    </p>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Layout>
    </LoginStyled>
  );
};

export default Login;
