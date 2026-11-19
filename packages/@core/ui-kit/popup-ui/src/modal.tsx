import type { ReactNode } from 'react';

import { createContext, useContext, useMemo, useRef, useState } from 'react';

import { Button, Modal } from 'antd';
import { createStore, useStore } from 'zustand';

import { Maximize, Minimize } from '@vben-core/icons';
import { cn } from '@vben-core/shared';

interface ModalState {
  cancelText?: ReactNode;
  centered?: boolean;
  /** کلاس بدنه */
  className?: string;
  closable?: boolean;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  confirmText?: ReactNode;
  data?: any;
  description?: ReactNode;
  destroyOnClose?: boolean;
  /** فوتر سفارشی؛ false = بدون فوتر */
  footer?: boolean | ReactNode;
  /** امکان تمام‌صفحه */
  fullscreen?: boolean;
  fullscreenButton?: boolean;
  /** نمایش لودینگ روی محتوا */
  loading?: boolean;
  /** بسته‌شدن با کلیک روی پس‌زمینه */
  maskClosable?: boolean;
  open: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  /** در حال ارسال (دکمه‌ها قفل می‌شوند) */
  submitting?: boolean;
  title?: ReactNode;
  width?: number | string;
}

interface ModalApiOptions extends Partial<ModalState> {
  onCancel?: () => void;
  onClosed?: () => void;
  onConfirm?: () => Promise<void> | void;
  onOpenChange?: (open: boolean) => void;
  onOpened?: () => void;
}

/**
 * API کنترل مودال (معادل modalApi در Vben)
 */
class ModalApi {
  options: ModalApiOptions;
  readonly store;

  constructor(options: ModalApiOptions = {}) {
    this.options = options;
    const { onCancel: _a, onClosed: _b, onConfirm: _c, onOpenChange: _d, onOpened: _e, ...state } = options;
    this.store = createStore<ModalState>()(() => ({
      centered: true,
      closable: true,
      destroyOnClose: true,
      footer: true,
      fullscreenButton: true,
      maskClosable: true,
      showCancelButton: true,
      showConfirmButton: true,
      ...state,
      open: false,
    }));
  }

  close = () => {
    this.setState({ open: false });
  };

  getData = <T = any,>(): T => this.store.getState().data as T;

  getState = () => this.store.getState();

  /** قفل کردن مودال هنگام ارسال */
  lock = (isLocked = true) => this.setState({ submitting: isLocked });

  onCancel = () => {
    if (this.options.onCancel) this.options.onCancel();
    else this.close();
  };

  onConfirm = async () => {
    await this.options.onConfirm?.();
  };

  open = () => {
    this.setState({ open: true });
  };

  setData = <T = any,>(data: T) => {
    this.store.setState({ data });
    return this;
  };

  setState = (state: ((prev: ModalState) => Partial<ModalState>) | Partial<ModalState>) => {
    const prev = this.store.getState();
    const partial = typeof state === 'function' ? state(prev) : state;
    this.store.setState(partial);
    if ('open' in partial && partial.open !== prev.open) {
      this.options.onOpenChange?.(!!partial.open);
    }
    return this;
  };

  unlock = () => this.lock(false);
}

const ModalContext = createContext<ModalApi | null>(null);

/**
 * دسترسی به API مودال از داخل محتوای آن
 */
function useModalContext() {
  const api = useContext(ModalContext);
  if (!api) throw new Error('useModalContext must be used inside a VbenModal');
  return api;
}

interface VbenModalProps extends Partial<Omit<ModalState, 'open'>> {
  children?: ReactNode;
}

function createModalComponent(api: ModalApi) {
  function VbenModal(props: VbenModalProps) {
    const storeState = useStore(api.store);
    const state = { ...storeState, ...props, open: storeState.open };
    const [isFullscreen, setIsFullscreen] = useState(false);
    const busy = state.submitting || state.confirmLoading;

    const footer =
      state.footer === false
        ? null
        : state.footer !== true && state.footer !== undefined
          ? state.footer
          : (
              <div className="flex justify-end gap-2">
                {state.showCancelButton && (
                  <Button disabled={state.submitting} onClick={api.onCancel}>
                    {state.cancelText ?? 'انصراف'}
                  </Button>
                )}
                {state.showConfirmButton && (
                  <Button
                    disabled={state.confirmDisabled}
                    loading={busy}
                    onClick={api.onConfirm}
                    type="primary"
                  >
                    {state.confirmText ?? 'تأیید'}
                  </Button>
                )}
              </div>
            );

    const title = (
      <div className="flex items-center justify-between pe-8">
        <div>
          <div>{state.title}</div>
          {state.description && (
            <div className="mt-1 text-xs font-normal text-muted-foreground">{state.description}</div>
          )}
        </div>
        {state.fullscreenButton && (
          <button
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setIsFullscreen((v) => !v)}
            type="button"
          >
            {isFullscreen ? <Minimize className="size-3.5" /> : <Maximize className="size-3.5" />}
          </button>
        )}
      </div>
    );

    return (
      <Modal
        afterClose={() => {
          setIsFullscreen(false);
          api.options.onClosed?.();
        }}
        afterOpenChange={(open) => open && api.options.onOpened?.()}
        centered={state.centered && !isFullscreen}
        className={cn(isFullscreen && 'vben-modal--fullscreen')}
        closable={state.closable && !state.submitting}
        destroyOnHidden={state.destroyOnClose}
        footer={footer}
        loading={state.loading}
        mask={{ closable: state.maskClosable && !state.submitting }}
        onCancel={() => !state.submitting && api.onCancel()}
        open={state.open}
        title={title}
        width={isFullscreen ? '100vw' : (state.width ?? 520)}
      >
        <ModalContext.Provider value={api}>
          <div className={state.className}>{state.children ?? props.children}</div>
        </ModalContext.Provider>
      </Modal>
    );
  }
  return VbenModal;
}

/**
 * ساخت مودال کنترل‌شونده با API
 * @example
 * const [Modal, modalApi] = useVbenModal({ title: 'عنوان', onConfirm() {...} });
 * modalApi.setData(row).open();
 */
function useVbenModal(options: ModalApiOptions = {}) {
  const apiRef = useRef<ModalApi | null>(null);
  if (!apiRef.current) apiRef.current = new ModalApi(options);
  const api = apiRef.current;
  // همیشه آخرین callbackها
  api.options = { ...api.options, ...options };
  const Component = useMemo(() => createModalComponent(api), [api]);
  return [Component, api] as const;
}

export { ModalApi, useModalContext, useVbenModal };
export type { ModalApiOptions, ModalState, VbenModalProps };
