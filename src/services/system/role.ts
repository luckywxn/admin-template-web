import request from '../request';

/** 获取角色列表 */
export async function getRoleList(
  body: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RoleList>('/api/system/role/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新建角色 */
export async function addRole(body:any) {
  return request('/api/system/role/created', {
    method: 'POST',
    data: body,
  });
}

/** 更新角色 */
export async function updateRule(body:any) {
  return request('/api/system/role/modify', {
    method: 'POST',
    data: body,
  });
}

/** 根据角色获权限 */
export async function getRolePermission(params:any) {
  return request('/api/system/role/getPermissionByRoleId', {
    method: 'GET',
    params,
  });
}

/** 给角色分配权限 */
export async function submitEditRolePermission(body:any) {
  return request('/api/system/role/grantRolePermission', {
    method: 'POST',
    data: body,
  });
}

/** 删除角色 */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
