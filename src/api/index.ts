import axios from 'axios';
import { ICommonSetting, ResponseWrap } from './types';
import { APP_KEY } from '../constants';
import { sdkManager } from '../utils';
import request from './request';

interface ResWrapper<T = {}> {
  message: string;
  statusCode: number;
  data: T;
}
// axios.interceptors.request.use(
//   config => {
//     // const sdk = await sdkManager.getSdkInstance();
//     config.headers['X-TOKEN'] = localStorage.getItem(`${APP_KEY}_token`) || '';
//     config.headers['x-lark-gw'] = 1;
//     return config;
//   },
//   err => Promise.reject(err),
// );
// axios.interceptors.response.use(
//   function (response) {
//     // const statusCode =
//     //   response.data?.status_code || response.data?.statusCode || response.data?.error?.code || 0;
//     //
//     // const errMsg =
//     //   response?.data?.error?.display_msg?.content ||
//     //   response?.data?.error?.display_msg?.title;
//     // if (statusCode !== 0 && errMsg) {
//     //   response.data = Object.assign(response.data, { errMsg });
//     //   return Promise.reject(new Error(errMsg));
//     // }
//     return response;
//   },
//   // 作为一个插件，如果报错，就捕获并上报，不要影响宿主业务
//   // TODO: 错误上报
//   function (error) {
//     // TODO: 401，403
//     return Promise.reject(error);
//   },
// );
// 获取自定义流转规则
export const getCommonSetting = (project_key: string) =>
  axios
    .get<unknown, ResponseWrap<ICommonSetting>>(
      `http://8.130.34.194:18081/config/${project_key}/config'`,
    )
    .then(res => res.data);
interface AuthRes {
  code: string;
  state: string;
  token: string;
  expireTime: string;
}
/**
 * Login authentication
 * @returns
 */
export async function authAgree(code: string) {
  const re:{msg:string}=await axios.get('http://jsonplaceholder.typicode.com/posts')
  console.log("RESSSS",re)
  const res = await axios
    .post<ResWrapper<AuthRes>>(`http://8.130.34.194:18081/login`, { code: code })
  console.log("RES",res.data)
  return res.data
}
