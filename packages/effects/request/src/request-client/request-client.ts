import type { AxiosInstance, AxiosResponse } from 'axios';

import type {
  ParamsSerializerType,
  RequestClientConfig,
  RequestClientOptions,
  SseRequestOptions,
} from './types';

import { merge } from '@vben/utils';
import axios from 'axios';

import { InterceptorManager } from './modules/interceptor';

/**
 * سریال‌سازی پارامترها بدون وابستگی به qs
 */
function serializeParams(params: Record<string, any>, format: ParamsSerializerType) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      switch (format) {
        case 'brackets': {
          value.forEach((v) => search.append(`${key}[]`, String(v)));
          break;
        }
        case 'comma': {
          search.append(key, value.join(','));
          break;
        }
        case 'indices': {
          value.forEach((v, i) => search.append(`${key}[${i}]`, String(v)));
          break;
        }
        default: {
          value.forEach((v) => search.append(key, String(v)));
        }
      }
    } else {
      search.append(key, value instanceof Date ? value.toISOString() : String(value));
    }
  }
  return search.toString();
}

function getParamsSerializer(paramsSerializer: RequestClientOptions['paramsSerializer']) {
  if (typeof paramsSerializer === 'string') {
    return (params: any) => serializeParams(params, paramsSerializer);
  }
  return paramsSerializer;
}

/**
 * کلاینت درخواست مبتنی بر axios با رهگیرها، آپلود، دانلود و SSE
 */
class RequestClient {
  public readonly instance: AxiosInstance;
  public isRefreshing = false;
  public refreshTokenQueue: ((token: null | string, error?: unknown) => void)[] = [];

  private interceptorManager: InterceptorManager;

  constructor(options: RequestClientOptions = {}) {
    const defaultConfig: RequestClientOptions = {
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      responseReturn: 'raw',
      timeout: 10_000,
    };
    const requestConfig = merge<RequestClientOptions>({}, options, defaultConfig);
    requestConfig.paramsSerializer = getParamsSerializer(
      requestConfig.paramsSerializer ?? 'repeat',
    );
    this.instance = axios.create(requestConfig as any);
    this.interceptorManager = new InterceptorManager(this.instance);
  }

  addRequestInterceptor: InterceptorManager['addRequestInterceptor'] = (config) =>
    this.interceptorManager.addRequestInterceptor(config);

  addResponseInterceptor: InterceptorManager['addResponseInterceptor'] = (config) =>
    this.interceptorManager.addResponseInterceptor(config);

  delete = <T = any>(url: string, config?: RequestClientConfig): Promise<T> =>
    this.request<T>(url, { ...config, method: 'DELETE' });

  /**
   * دانلود فایل به‌صورت Blob
   */
  download = async <T = Blob>(
    url: string,
    config?: RequestClientConfig,
  ): Promise<T> => {
    return this.request<T>(url, {
      method: 'GET',
      responseReturn: 'body',
      responseType: 'blob',
      ...config,
    });
  };

  get = <T = any>(url: string, config?: RequestClientConfig): Promise<T> =>
    this.request<T>(url, { ...config, method: 'GET' });

  getBaseUrl = () => this.instance.defaults.baseURL;

  post = <T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> =>
    this.request<T>(url, { ...config, data, method: 'POST' });

  /**
   * ارسال درخواست POST با پاسخ جریانی (Server-Sent Events)
   */
  postSSE = async (url: string, data?: any, options: SseRequestOptions = {}) => {
    const { onEnd, onMessage, ...init } = options;
    const baseURL = this.getBaseUrl() ?? '';
    const response = await fetch(`${baseURL}${url}`, {
      body: data === undefined ? undefined : JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', ...(init.headers as any) },
      method: 'POST',
      ...init,
    });
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onMessage?.(decoder.decode(value, { stream: true }));
    }
    onEnd?.();
  };

  put = <T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> =>
    this.request<T>(url, { ...config, data, method: 'PUT' });

  request = async <T>(url: string, config: RequestClientConfig): Promise<T> => {
    const response: AxiosResponse<T> = await this.instance({
      url,
      ...config,
      ...(config.paramsSerializer
        ? { paramsSerializer: getParamsSerializer(config.paramsSerializer) }
        : {}),
    } as any);
    return response as T;
  };

  /**
   * آپلود فایل با FormData
   */
  upload = async <T = any>(
    url: string,
    data: Record<string, any> & { file: Blob | File },
    config?: RequestClientConfig,
  ): Promise<T> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => formData.append(`${key}[${index}]`, item));
      } else {
        formData.append(key, value);
      }
    });
    return this.post<T>(url, formData, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data', ...config?.headers },
    });
  };
}

export { RequestClient };
