import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import StoreProvider from "./StoreProvider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dot Connect",
  description: "Generated by next app",
  icons: {
    icon: '/connections.png',
    shortcut: '/connections.png',
    apple: '/connections.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Providers>
            <Header />
            {children}
            <Toaster />
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
