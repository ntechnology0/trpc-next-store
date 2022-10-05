import { captureException, flush } from "@sentry/nextjs";
import NextErrorComponent from "next/error";
import type { ErrorProps } from "next/error";
import type { NextPage } from "next";

interface ErrorComponentProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

const ErrorComponent: NextPage<ErrorComponentProps> = ({
  hasGetInitialPropsRun,
  err,
  statusCode,
}) => {
  if (!hasGetInitialPropsRun && err) {
    captureException(err);
  }
  return <NextErrorComponent statusCode={statusCode} />;
};

ErrorComponent.getInitialProps = async (ctx) => {
  const errorInitialProps: ErrorComponentProps =
    await NextErrorComponent.getInitialProps(ctx);
  errorInitialProps.hasGetInitialPropsRun = true;
  if (ctx.err) {
    captureException(ctx.err);
    await flush(2000);
    return errorInitialProps;
  }
  captureException(
    new Error(`_error.tsx getInitialProps missing data at path: ${ctx.asPath}`)
  );
  await flush(2000);

  return errorInitialProps;
};

export default ErrorComponent;
