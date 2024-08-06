// import { Toast } from '@douyinfe/semi-ui';
// import axios from 'axios';
// import { APP_KEY, requestHost } from '../constants';
// import { sdkManager } from '../utils';
//
// const toastCache = {};
// const toastCallBack = (e: Error) => {
//   if (!Object.prototype.hasOwnProperty.call(toastCache, e.message)) {
//     toastCache[e.message] = 1;
//     Toast.error({
//       content: e.message,
//       onClose: () => {
//         delete toastCache[e.message];
//       },
//     });
//     console.error(e);
//   }
// };
//
// const request = axios;
//
// const baseUrl = requestHost;
//
// request.interceptors.request.use(
//   async config => {
//     // 在请求发送之前做一些处理
//     // 添加请求头信息
//     const sdk = await sdkManager.getSdkInstance();
//     const token = sdk.storage.getItem(`${APP_KEY}_token`);
//     if (config.url?.startsWith('/')) {
//       config.url = baseUrl + config.url;
//     }
//     config.headers['X-TOKEN'] = token;
//     config.headers['x-lark-gw'] = 1;
//     // config.headers["locale"] = lang;
//     return config;
//   },
//   error => {
//     // 对请求错误做些什么
//     console.error(error);
//     return Promise.reject(error);
//   },
// );
//
// // 响应拦截器
// request.interceptors.response.use(
//   async (response: { data: any }) => {
//     const sdk = await sdkManager.getSdkInstance();
//     // 在响应之前做一些处理
//     const res = response.data;
//     if (res.code === 0 || res.status_code === 0) {
//       return res;
//     }
//     if (res.code === 1000052203 || res.status_code === 1000052203) {
//       sdk.storage.removeItem(`${APP_KEY}_token`);
//       sdk.storage.removeItem(`${APP_KEY}_expire_time`);
//       return res;
//     }
//     // 根据返回的业务错误码进行错误处理
//     return Promise.reject(
//       res.msg || res.error?.localizedMessage?.message || new Error(JSON.stringify(res)),
//     );
//   },
//   (error: Error) => {
//     // 对响应错误做些什么
//     toastCallBack(error);
//     return Promise.reject(error);
//   },
// );
//
// export default request;
