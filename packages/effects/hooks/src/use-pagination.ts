import { useMemo, useState } from 'react';

/**
 * صفحه‌بندی سمت کلاینت
 */
function usePagination<T>(list: T[], pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginationList = useMemo(() => {
    const offset = (currentPage - 1) * pageSize;
    return list.slice(offset, offset + pageSize);
  }, [currentPage, list, pageSize]);

  return { currentPage, paginationList, setCurrentPage, total, totalPages };
}

export { usePagination };
