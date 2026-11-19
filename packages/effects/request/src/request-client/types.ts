import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type ParamsSerializerType = 'brackets' | 'comma' | 'indices' | 'repeat';

type ExtendOptions<T = any> = {
  /** قالب سریال‌سازی پارامترهای آرایه‌ای */
  paramsSerializer?: AxiosRequestConfig<T>['paramsSerializer'] | ParamsSerializerType;
  /**
   * چه چیزی برگردانده شود:
   * raw: کل پاسخ axios — body: بدنه‌ی پاسخ — data: فیلد data بدنه (پس از بررسی کد)
   */
  responseReturn?: 'body' | 'data' | 'raw';
};

type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions<T>;

type RequestResponse<T = any> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) =>
    | (ExtendOptions & InternalAxiosRequestConfig)
    | Promise<ExtendOptions & InternalAxiosRequestConfig>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (response: RequestResponse<T>) => any;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn = (message: string, error: any) => void;

interface HttpResponse<T = any> {
  /** ۰ یعنی موفق */
  code: number;
  data: T;
  message: string;
}

interface SseRequestOptions extends RequestInit {
  onEnd?: () => void;
  onMessage?: (message: string) => void;
}

export type {
  HttpResponse,
  MakeErrorMessageFn,
  ParamsSerializerType,
  RequestClientConfig,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
  SseRequestOptions,
};
