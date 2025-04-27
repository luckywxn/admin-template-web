// @ts-ignore
/* eslint-disable */
// import { request } from '@umijs/max';
import request from '../request';


/** 获取用户列表 */
export async function getUserList(
  body: {
    // query
    /** 当前的页码 */
    pageNo?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/system/user/list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


/** 新建用户 */
export async function addUser(body:any) {
    return request('/api/system/user/created', {
      method: 'POST',
      data: body,
    });
  }
  
  /** 更新用户 */
  export async function updateUser(body:any) {
    return request('/api/system/user/modify', {
      method: 'POST',
      data: body,
    });
  }
  /** 获取管理员角色 */
  export async function getUserRoleByUserId(params:any) {
    return request('/api/system/user/getUserRoleByUserId', {
      method: 'GET',
      params,
    });
  }

  /** 给用户分配角色 */
  export async function submitEditUserRole(body:any) {
    return request('/api/system//user/grantUserRole', {
      method: 'POST',
      data: body,
    });
  }