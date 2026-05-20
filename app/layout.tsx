import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Echo Map",
  description: "Echo Map — our shared footprint planet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-full antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
