"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "../logo";
import { ThemeToggler } from "../theme-toggler";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { SidebarLinks } from "./sidebar-links";

export const MobileSidebar = ({ isModerator }: { isModerator: boolean }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClick}>
      <SheetTrigger
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition"
        )}
        onClick={handleClick}
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 py-3 flex flex-col gap-5">
        <Logo className="ml-10" />
        <SidebarLinks
          layoutId="mobileSidebar"
          isModerator={isModerator}
          onOpenChange={() => open && setOpen(false)}
        />
        <ThemeToggler className="mt-auto ml-10" />
      </SheetContent>
    </Sheet>
  );
};
