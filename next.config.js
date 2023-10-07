/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SITE_NAME: process.env.SITE_NAME || "DkBlog",
    SITE_LOCALE: process.env.SITE_LOCALE || "en_US",
    SITE_BASEURL: process.env.SITE_BASEURL || "http://localhost:3000",
  },
};

module.exports = nextConfig;
