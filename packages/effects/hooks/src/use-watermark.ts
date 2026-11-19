import { create } from 'zustand';

interface WatermarkState {
  /** متن واترمارک (آرایه = چند خط) */
  content?: string | string[];
  enable: boolean;
}

/**
 * وضعیت سراسری واترمارک — در چیدمان پایه با کامپوننت Watermark در antd رندر می‌شود
 */
const useWatermarkStore = create<WatermarkState>()(() => ({
  content: undefined,
  enable: false,
}));

function useWatermark() {
  const state = useWatermarkStore();
  return {
    destroyWatermark: () => useWatermarkStore.setState({ content: undefined, enable: false }),
    updateWatermark: (options: { content: string | string[] }) =>
      useWatermarkStore.setState({ content: options.content, enable: true }),
    watermark: state,
  };
}

export { useWatermark, useWatermarkStore };
