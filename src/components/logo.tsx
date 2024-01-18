"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      href="/"
      className={cn("relative w-[200px] h-[50px] overflow-hidden", className)}
    >
      <Image
        src="/images/logo-light.png"
        fill
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/images/logo-dark.png"
        fill
        alt="Logo"
        className="hidden dark:block"
      />
    </Link>
  );
};
