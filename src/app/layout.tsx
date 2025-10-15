import "./globals.css";
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

const description = "A dynamic blog using markdown with Next.Js.";
export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_BASEURL),
  title: {
    default: env.SITE_NAME,
    template: `%s • ${env.SITE_NAME}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
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
    description,
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
    description,
    card: "summary",
  },
};
export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ theme: clerkTheme }}>
      <html lang="en" suppressHydrationWarning>
        <body className={merriweatherSans.variable}>
          <ThemeProvider attribute="class">
            <Header />
            <ToastContainer
              autoClose={3000}
              position="top-right"
              theme="dark"
              newestOnTop
              pauseOnFocusLoss={false}
              limit={3}
              stacked
              className="bg-background! font-merriweather-sans! text-foreground! z-999999"
              toastClassName="bg-background! text-foreground!"
            />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
