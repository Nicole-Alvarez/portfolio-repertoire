"use client";

import { ParallaxProvider } from "react-scroll-parallax";

export default function AppParallaxProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}

