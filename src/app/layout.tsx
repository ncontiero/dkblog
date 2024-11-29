import "react-toastify/dist/ReactToastify.min.css";
import "./globals.css";
import "./mdx.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Merriweather_Sans as MerriweatherSans } from "next/font/google";
import { Header } from "@/components/Header";
import { env } from "@/env";
import { clerkTheme } from "./clerkTheme";

const merriweatherSans = MerriweatherSans({
  subsets: ["latin"],
  variable: "--font-merriweather-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_BASEURL),
  title: {
    default: env.SITE_NAME,
    template: `%s • ${env.SITE_NAME}`,
  },
  description: "A dynamic blog using markdown with Next.Js.",
  alternates: {
    canonical: "/",
  },
  manifest: `${env.SITE_BASEURL}/manifest.json`,
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
      default: env.SITE_NAME,
      template: `%s • ${env.SITE_NAME}`,
    },
    description: "A dynamic blog using markdown with Next.Js.",
    siteName: env.SITE_NAME,
    type: "website",
    url: "/",
    locale: env.SITE_LOCALE,
  },
  twitter: {
    title: {
      default: env.SITE_NAME,
      template: `%s • ${env.SITE_NAME}`,
    },
    description: "A dynamic blog using markdown with Next.Js.",
    card: "summary",
  },
};
export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: clerkTheme }}>
      <html lang="en" className={merriweatherSans.variable}>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system">
            <Header />
            <ToastContainer
              autoClose={3000}
              position="top-right"
              theme="dark"
              newestOnTop
              pauseOnFocusLoss={false}
              limit={3}
              toastClassName="bg-background"
              bodyClassName="text-foreground"
              progressClassName="bg-primary"
            />
            <div className="pt-16">{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
