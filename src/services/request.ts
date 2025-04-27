/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend } from 'umi-request';
import { notification } from 'antd';

const codeEnum = {
  success: 200,
  tokenExpire: 401,
  noGa: 101011,
  cardImportWarn: 101025,
  statusWrong: 101014,
};

/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */
const errorHandler = (error: any) => {
  const { code, message } = error;
  if ([codeEnum.tokenExpire].includes(code)) {
    window.location.href = '/login';
    return;
  }
  if(code != 200){
    notification.error({
      message: `${code}:${message}`,
    });
  }
  return error;
};

/**
 * 配置request请求时的默认参数
 */
const umi_request = extend({
  errorHandler,
  credentials: 'include',
});

umi_request.interceptors.request.use((_, options: any) => {
  console.log(options);
  if (options.data) {
    options.data.requesrId = `${Date.now()}`;
  }
  if (options.params) {
    options.params.requesrId = Date.now();
  }
  options.headers.Authorization = localStorage.getItem('admin_token')
  return {
    options: {
      ...options,
      interceptors: true,
    },
  };
});

umi_request.interceptors.response.use(async (response: any) => {
  const disposition = response.headers.get('Content-Disposition'); // 获取Content-Disposition
  if (disposition) {
    return {
      blob: await response.blob(), // 将二进制的数据转为blob对象，这一步是异步的因此使用async/await
      fileName: decodeURI(disposition.split(';')[1].split('filename=')[1]), // 处理Content-Disposition，获取header中的文件名
    };
  }
  const token = response.headers.get('authorization');
  if (token) {
    localStorage.setItem('admin_token', token);
  }
  const res = await response.clone().json();
  if (res.code !== 0) {
    // localStorage.clear();
    return Promise.reject(res);
    // window.location.pathname = '/user/login';
  }
  return response;
});

export default umi_request;
