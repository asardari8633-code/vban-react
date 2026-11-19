import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemApi {
  export interface Dept {
    [key: string]: any;
    children?: Dept[];
    id: string;
    name: string;
    remark?: string;
    status: 0 | 1;
  }

  export interface Role {
    [key: string]: any;
    id: string;
    name: string;
    permissions: number[];
    remark?: string;
    status: 0 | 1;
  }

  export interface User {
    [key: string]: any;
    deptId: string;
    email?: string;
    gender: 1 | 2;
    id: string;
    mobile?: string;
    remark?: string;
    status: 0 | 1;
    userName: string;
  }

  export interface SystemMenu {
    [key: string]: any;
    authCode?: string;
    children?: SystemMenu[];
    component?: string;
    id: number | string;
    meta?: Recordable<any>;
    name: string;
    path?: string;
    pid?: number | string;
    status: 0 | 1;
    type: 'button' | 'catalog' | 'embedded' | 'link' | 'menu';
  }

  export interface PageResult<T> {
    items: T[];
    total: number;
  }
}

/* بخش‌ها */
export const getDeptList = () => requestClient.get<SystemApi.Dept[]>('/system/dept/list');
export const createDept = (data: Omit<SystemApi.Dept, 'children' | 'id'>) => requestClient.post('/system/dept', data);
export const updateDept = (id: string, data: Partial<SystemApi.Dept>) => requestClient.put(`/system/dept/${id}`, data);
export const deleteDept = (id: string) => requestClient.delete(`/system/dept/${id}`);

/* نقش‌ها */
export const getRoleList = (params: Recordable<any>) =>
  requestClient.get<SystemApi.PageResult<SystemApi.Role>>('/system/role/list', { params });
export const createRole = (data: Omit<SystemApi.Role, 'id'>) => requestClient.post('/system/role', data);
export const updateRole = (id: string, data: Partial<SystemApi.Role>) => requestClient.put(`/system/role/${id}`, data);
export const deleteRole = (id: string) => requestClient.delete(`/system/role/${id}`);

/* کاربران */
export const getUserList = (params: Recordable<any>) =>
  requestClient.get<SystemApi.PageResult<SystemApi.User>>('/system/user/list', { params });
export const createUser = (data: Omit<SystemApi.User, 'id'>) => requestClient.post('/system/user', data);
export const updateUser = (id: string, data: Partial<SystemApi.User>) => requestClient.put(`/system/user/${id}`, data);
export const deleteUser = (id: string) => requestClient.delete(`/system/user/${id}`);

/* منوها */
export const getMenuList = () => requestClient.get<SystemApi.SystemMenu[]>('/system/menu/list');
export const isMenuNameExists = (name: string, id?: number | string) =>
  requestClient.get<boolean>('/system/menu/name-exists', { params: { id, name } });
export const isMenuPathExists = (path: string, id?: number | string) =>
  requestClient.get<boolean>('/system/menu/path-exists', { params: { id, path } });
export const createMenu = (data: Omit<SystemApi.SystemMenu, 'children' | 'id'>) => requestClient.post('/system/menu', data);
export const updateMenu = (id: number | string, data: Partial<SystemApi.SystemMenu>) =>
  requestClient.put(`/system/menu/${id}`, data);
export const deleteMenu = (id: number | string) => requestClient.delete(`/system/menu/${id}`);
