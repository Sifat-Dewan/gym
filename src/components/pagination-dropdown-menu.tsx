"use client";

import { useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQueryString } from "@/hooks/use-query-string";

export const PaginationDropdownMenu = ({ maxPages }: { maxPages: number }) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const page = searchParams.get("page") || 1;
  const { handleClick } = useQueryString();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="group font-medium flex bg-background items-center justify-between px-4 py-1 text-sm gap-4 rounded-md border shadow-sm hover:bg-secondary">
        {page}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition",
            open && "rotate-180"
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <ScrollArea className="h-[300px] py-1 min-w-[70px]">
          <div className="space-y-2.5">
            {Array.from({ length: maxPages }).map((_, index) => (
              <div
                onClick={() => {
                  handleClick({ key: "page", value: index + 1 });
                  setOpen(false);
                }}
                role="button"
                key={index}
                className="px-4 text-sm font-medium py-1 hover:bg-secondary transition-colors"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};