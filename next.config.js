const { withPlausibleProxy } = require("next-plausible");
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  sentry: {
    hideSourceMaps: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: true,
  compress: true,
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === "production" ? true : false,
  },
  images: {
    domains: [
      "imagedelivery.net",
      "res.cloudinary.com",
      "okwwpfqyvkqjvcjpzjrw.supabase.co",
    ],
  },
  env: {
    POSTMARK_SMTP_SERVER: process.env.POSTMARK_SMTP_SERVER,
    POSTMARK_SMTP_PORT: process.env.POSTMARK_SMTP_PORT,
    POSTMARK_SMTP_USERNAME: process.env.POSTMARK_SMTP_USERNAME,
    POSTMARK_SMTP_PASSWORD: process.env.POSTMARK_SMTP_PASSWORD,
    POSTMARK_SMTP_ENCRYPTION: process.env.POSTMARK_SMTP_ENCRYPTION,
    POSTMARK_SMTP_FROM: process.env.POSTMARK_SMTP_FROM,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withPlausibleProxy()(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions)
);
