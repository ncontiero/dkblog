// SEO ENV
export const SITE_NAME = process.env.SITE_NAME || "DkBlog";
export const SITE_BASEURL = process.env.SITE_BASEURl || "http://localhost:3000";
export const SITE_LOCALE = process.env.SITE_LOCALE || "en-US";

// API ENV
export const API_URL = process.env.API_URL || `${SITE_BASEURL}/api`;

if (!SITE_BASEURL) throw new Error("Missing env.SITE_BASEURL");
