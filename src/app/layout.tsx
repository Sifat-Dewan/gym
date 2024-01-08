import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(inter.className, "min-h-screen flex flex-col gap-3")}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider />
            <Header />
            <main className="flex-1 flex-grow min-h-screen">{children}</main>
            Footer
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
