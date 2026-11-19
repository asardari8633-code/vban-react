import type { AxiosInstance } from 'axios';

import type {
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from '../types';

const defaultRequestInterceptorConfig: RequestInterceptorConfig = {
  fulfilled: (config) => config,
  rejected: (error) => Promise.reject(error),
};

const defaultResponseInterceptorConfig: ResponseInterceptorConfig = {
  fulfilled: (response) => response,
  rejected: (error) => Promise.reject(error),
};

class InterceptorManager {
  private axiosInstance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.axiosInstance = instance;
  }

  addRequestInterceptor({
    fulfilled,
    rejected,
  }: RequestInterceptorConfig = defaultRequestInterceptorConfig) {
    this.axiosInstance.interceptors.request.use(fulfilled as any, rejected);
  }

  addResponseInterceptor<T = any>({
    fulfilled,
    rejected,
  }: ResponseInterceptorConfig<T> = defaultResponseInterceptorConfig) {
    this.axiosInstance.interceptors.response.use(fulfilled as any, rejected);
  }
}

export { InterceptorManager };
