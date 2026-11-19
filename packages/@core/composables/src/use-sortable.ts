import type { DragEvent } from 'react';

import { useCallback, useRef, useState } from 'react';

interface UseSortableOptions {
  /** آیا آیتم با این ایندکس قابل جابه‌جایی است */
  canDrag?: (index: number) => boolean;
  /** آیا می‌توان روی این ایندکس رها کرد */
  canDrop?: (index: number) => boolean;
  disabled?: boolean;
  onSort: (oldIndex: number, newIndex: number) => void;
}

/**
 * مرتب‌سازی ساده با کشیدن و رها کردن (HTML5 drag & drop)
 */
function useSortable({ canDrag, canDrop, disabled, onSort }: UseSortableOptions) {
  const dragIndex = useRef<null | number>(null);
  const [overIndex, setOverIndex] = useState<null | number>(null);
  const [draggingIndex, setDraggingIndex] = useState<null | number>(null);

  const getItemProps = useCallback(
    (index: number) => {
      if (disabled || (canDrag && !canDrag(index))) {
        return { draggable: false };
      }
      return {
        draggable: true,
        onDragEnd: () => {
          dragIndex.current = null;
          setOverIndex(null);
          setDraggingIndex(null);
        },
        onDragOver: (e: DragEvent) => {
          if (dragIndex.current === null) return;
          if (canDrop && !canDrop(index)) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setOverIndex(index);
        },
        onDragStart: (e: DragEvent) => {
          dragIndex.current = index;
          setDraggingIndex(index);
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(index));
        },
        onDrop: (e: DragEvent) => {
          e.preventDefault();
          const from = dragIndex.current;
          dragIndex.current = null;
          setOverIndex(null);
          setDraggingIndex(null);
          if (from !== null && from !== index) onSort(from, index);
        },
      };
    },
    [canDrag, canDrop, disabled, onSort],
  );

  return { draggingIndex, getItemProps, overIndex };
}

export { useSortable };
export type { UseSortableOptions };
