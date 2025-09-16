import { useState, useMemo, useEffect } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({ items, itemsPerPage }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Get current page items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Check if navigation is possible
  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  return {
    paginatedItems,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    canGoNext,
    canGoPrevious,
    totalItems: items.length,
    showingItems: paginatedItems.length,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, items.length)
  };
};