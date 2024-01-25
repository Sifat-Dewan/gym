"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import ReactPaginate from "react-paginate";
import qs from "query-string";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (page: number) => {
    const currentQuery = qs.parse(params.toString());
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        ...currentQuery,
        page,
      },
    });

    router.push(url, { scroll: false });
  };

  const handlePageClick = (event: { selected: number }) => {
    setIsLoading(true);
    const newPageNumber = event.selected + 1;
    handleClick(newPageNumber);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [params]);

  return (
    <>
      <ReactPaginate
        className="flex gap-5 font-semibold text-foreground/60 items-center flex-wrap justify-center bg-accent w-fit mx-auto rounded-lg py-2 px-3 transition-all"
        breakLabel="..."
        breakClassName=""
        nextLabel=">"
        nextClassName={cn(
          "font-extrabold",
          currentPage === totalPages && "pointer-events-none opacity-50"
        )}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        activeClassName="bg-primary px-3 py-1 text-white rounded-md"
        pageClassName=""
        previousLabel="<"
        previousClassName={cn(
          "font-extrabold",
          currentPage === 1 && "pointer-events-none opacity-50"
        )}
        renderOnZeroPageCount={null}
      />
      {isLoading && (
        <div className="fixed inset-0">
          <Loader />
        </div>
      )}
    </>
  );
};