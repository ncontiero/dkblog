/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.NEXT_PUBLIC_IMG_DOMAINS.split(","),
  },
  env: {
    SITE_NAME: process.env.SITE_NAME || "DkBlog",
    SITE_LOCALE: process.env.SITE_LOCALE || "en_US",
    SITE_BASEURL: process.env.SITE_BASEURL || "http://localhost:3000",
  },
};

module.exports = nextConfig;
