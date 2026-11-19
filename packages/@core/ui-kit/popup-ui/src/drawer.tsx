import type { ReactNode } from 'react';

import { createContext, useContext, useMemo, useRef } from 'react';

import { Button, Drawer } from 'antd';
import { createStore, useStore } from 'zustand';

import { isRtl } from '@vben-core/shared';

interface DrawerState {
  cancelText?: ReactNode;
  className?: string;
  closable?: boolean;
  confirmLoading?: boolean;
  confirmText?: ReactNode;
  data?: any;
  description?: ReactNode;
  destroyOnClose?: boolean;
  footer?: boolean | ReactNode;
  loading?: boolean;
  maskClosable?: boolean;
  open: boolean;
  placement?: 'bottom' | 'left' | 'right' | 'top';
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  submitting?: boolean;
  title?: ReactNode;
  width?: number | string;
}

interface DrawerApiOptions extends Partial<DrawerState> {
  onCancel?: () => void;
  onClosed?: () => void;
  onConfirm?: () => Promise<void> | void;
  onOpenChange?: (open: boolean) => void;
}

/**
 * API کنترل کشو (معادل drawerApi در Vben)
 */
class DrawerApi {
  options: DrawerApiOptions;
  readonly store;

  constructor(options: DrawerApiOptions = {}) {
    this.options = options;
    const { onCancel: _a, onClosed: _b, onConfirm: _c, onOpenChange: _d, ...state } = options;
    this.store = createStore<DrawerState>()(() => ({
      closable: true,
      destroyOnClose: true,
      footer: true,
      maskClosable: true,
      showCancelButton: true,
      showConfirmButton: true,
      ...state,
      open: false,
    }));
  }

  close = () => this.setState({ open: false });

  getData = <T = any,>(): T => this.store.getState().data as T;

  getState = () => this.store.getState();

  lock = (isLocked = true) => this.setState({ submitting: isLocked });

  onCancel = () => {
    if (this.options.onCancel) this.options.onCancel();
    else this.close();
  };

  onConfirm = async () => {
    await this.options.onConfirm?.();
  };

  open = () => this.setState({ open: true });

  setData = <T = any,>(data: T) => {
    this.store.setState({ data });
    return this;
  };

  setState = (state: ((prev: DrawerState) => Partial<DrawerState>) | Partial<DrawerState>) => {
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

const DrawerContext = createContext<DrawerApi | null>(null);

function useDrawerContext() {
  const api = useContext(DrawerContext);
  if (!api) throw new Error('useDrawerContext must be used inside a VbenDrawer');
  return api;
}

interface VbenDrawerProps extends Partial<Omit<DrawerState, 'open'>> {
  children?: ReactNode;
}

function createDrawerComponent(api: DrawerApi) {
  function VbenDrawer(props: VbenDrawerProps) {
    const storeState = useStore(api.store);
    const state = { ...storeState, ...props, open: storeState.open };
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
                  <Button loading={busy} onClick={api.onConfirm} type="primary">
                    {state.confirmText ?? 'تأیید'}
                  </Button>
                )}
              </div>
            );

    return (
      <Drawer
        afterOpenChange={(open) => !open && api.options.onClosed?.()}
        closable={state.closable && !state.submitting}
        destroyOnHidden={state.destroyOnClose}
        footer={footer}
        loading={state.loading}
        mask={{ closable: state.maskClosable && !state.submitting }}
        onClose={() => !state.submitting && api.onCancel()}
        open={state.open}
        placement={state.placement ?? (isRtl() ? 'left' : 'right')}
        size={state.width ?? 520}
        title={
          <div>
            <div>{state.title}</div>
            {state.description && (
              <div className="mt-1 text-xs font-normal text-muted-foreground">{state.description}</div>
            )}
          </div>
        }
      >
        <DrawerContext.Provider value={api}>
          <div className={state.className}>{props.children}</div>
        </DrawerContext.Provider>
      </Drawer>
    );
  }
  return VbenDrawer;
}

/**
 * ساخت کشوی کنترل‌شونده با API
 */
function useVbenDrawer(options: DrawerApiOptions = {}) {
  const apiRef = useRef<DrawerApi | null>(null);
  if (!apiRef.current) apiRef.current = new DrawerApi(options);
  const api = apiRef.current;
  api.options = { ...api.options, ...options };
  const Component = useMemo(() => createDrawerComponent(api), [api]);
  return [Component, api] as const;
}

export { DrawerApi, useDrawerContext, useVbenDrawer };
export type { DrawerApiOptions, DrawerState, VbenDrawerProps };
