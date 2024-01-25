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
      className={cn("relative overflow-hidden", className)}
    >
      <Image
        src="/images/logo.png"
        height={60}
        width={120}
        alt="Logo"
      />
    </Link>
  );
};
