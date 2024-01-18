import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { cn, isModerator } from "@/lib/utils";
import { ToastProvider } from "@/providers/toast-provider";
import ModalProvider from "@/providers/modal-provider";
import { currentUser } from "@/lib/current-user";
import { ConfettiProvider } from "@/providers/confetti-provider";
import { InstituteName } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: InstituteName,
  description: "Empowering Fitness, Building Strong Lives",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(inter.className, "overflow-x-hidden bg-gray-100 dark:bg-gray-900")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider />
            <ModalProvider />
            <ConfettiProvider />
            <main className="pb-10 min-h-screen flex flex-col gap-3">
              <Header user={user} />
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
