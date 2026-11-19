import { requestClient } from '#/api/request';

export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }

  export interface Product {
    [key: string]: any;
    available: boolean;
    category: string;
    id: string;
    imageUrl: string;
    price: string;
    productName: string;
    quantity: number;
    rating: number;
    releaseDate: string;
    status: 'error' | 'success' | 'warning';
  }
}

/** دریافت داده‌ی جدول نمونه */
export async function getExampleTableApi(params: DemoTableApi.PageFetchParams) {
  return requestClient.get<{ items: DemoTableApi.Product[]; total: number }>('/table/list', { params });
}
