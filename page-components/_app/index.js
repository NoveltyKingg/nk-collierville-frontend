import React, { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "./layout";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { HeroUIProvider } from "@heroui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, ...rest }) {
  const { pageProps, router } = rest;

  const [layout, setLayout] = useState(false);

  return (
    <HeroUIProvider className="nk-theme">
      <div className={`${geistSans.className} ${geistMono.className}`}>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </div>
    </HeroUIProvider>
  );
}
