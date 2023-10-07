import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { SITE_BASEURL, SITE_LOCALE, SITE_NAME } from "@/utils/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASEURL),
  title: {
    default: SITE_NAME,
    template: `%s • ${SITE_NAME}`,
  },
  description: "A blog using Next.Js.",
  alternates: {
    canonical: "/",
  },
  manifest: `${SITE_BASEURL}/manifest.json`,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: {
      default: SITE_NAME,
      template: `%s • ${SITE_NAME}`,
    },
    description: "A blog using Next.Js.",
    siteName: SITE_NAME,
    type: "website",
    url: "/",
    locale: SITE_LOCALE,
  },
  twitter: {
    title: {
      default: SITE_NAME,
      template: `%s • ${SITE_NAME}`,
    },
    description: "A blog using Next.Js.",
    card: "summary",
  },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
