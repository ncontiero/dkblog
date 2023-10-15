import "react-toastify/dist/ReactToastify.min.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Merriweather_Sans as MerriweatherSans } from "next/font/google";

import { ToastContainer } from "react-toastify";
import { SITE_BASEURL, SITE_LOCALE, SITE_NAME } from "@/utils/constants";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

const merriweatherSans = MerriweatherSans({
  subsets: ["latin"],
  variable: "--font-merriweather-sans",
});

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
    <html lang="en" className={merriweatherSans.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Header />
          <ToastContainer
            autoClose={3000}
            position="top-right"
            theme="dark"
            newestOnTop={true}
            pauseOnFocusLoss={false}
            limit={3}
            toastClassName="bg-background"
            bodyClassName="text-foreground"
            progressClassName="bg-primary"
          />
          <div className="pt-16 sm:container">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
