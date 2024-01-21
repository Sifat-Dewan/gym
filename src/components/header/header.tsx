"use client";

import { UserButton } from "@clerk/nextjs";
import { Logo } from "../logo";
import MaxWidthWrapper from "../max-width-wrapper";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { User } from "@prisma/client";
import { isModerator } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Header = ({ user }: { user: User | null }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/sign-in";
  return (
    <header className="sticky z-50 bg-background/80 backdrop-blur-lg top-0 inset-x-0 border-b">
      <MaxWidthWrapper className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileSidebar isModerator={isModerator(user)} />
            <Logo />
          </div>
          {user ? (
            <div className="w-[32px]">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Link
              href={isLoginPage ? "/auth/sign-up" : "/auth/sign-in"}
              className={buttonVariants()}
            >
              {isLoginPage ? "Sign up" : "Log in"}
            </Link>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
};
