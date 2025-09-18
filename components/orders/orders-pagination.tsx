"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function OrdersPagination({
  currentPage,
  totalPages,
}: OrdersPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/orders?${params.toString()}`);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than or equal to maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page area, and last page
      if (currentPage <= 3) {
        // Show first 3 pages + ... + last page
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ... + last 4 pages
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Show first page + ... + current area + ... + last page
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center gap-2">
      {/* First Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(1)}
        disabled={currentPage === 1 || totalPages <= 1}
        className="hidden sm:flex"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1 || totalPages <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {totalPages <= 1 ? (
          <div className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md">
            1
          </div>
        ) : (
          pageNumbers.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-2 py-1 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => changePage(page as number)}
                  className="w-10 h-8"
                >
                  {page}
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Next Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages <= 1}
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(totalPages)}
        disabled={currentPage === totalPages || totalPages <= 1}
        className="hidden sm:flex"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>

      {/* Page Info */}
      <div className="ml-2 text-sm text-muted-foreground hidden md:block">
        {totalPages > 1 ? (
          <>
            Page {currentPage} of {totalPages}
          </>
        ) : (
          <>1 page</>
        )}
      </div>
    </div>
  );
}
