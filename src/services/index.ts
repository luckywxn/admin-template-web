// @ts-ignore
/* eslint-disable */
// import { request } from '@umijs/max';
import request from './request';


/** 登录接口 POST */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/system/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 获取当前的用户 */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/system/user/info', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 退出登录接口 */
export async function outLogin() {
  return request('/api/system/user/loginOut', {
    method: 'POST',
  });
}
