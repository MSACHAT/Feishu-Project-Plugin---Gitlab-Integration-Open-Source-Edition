import { Toast } from "@douyinfe/semi-ui";
import axios from "axios";
import { APP_KEY, requestHost } from "../constants";
import { isLogin } from "../accessControl";

const sdk = window.JSSDK;

const toastCache = {};
const toastCallBack = (e: Error) => {
  if (!Object.prototype.hasOwnProperty.call(toastCache, e.message)) {
    toastCache[e.message] = 1;
    Toast.error({
      content: e.message,
      onClose: () => {
        delete toastCache[e.message];
      },
    });
    console.error(e);
  }
};


const request = axios;

const baseUrl = requestHost;

request.interceptors.request.use(

  async function (config) {

    // 在请求发送之前做一些处理
    // 添加请求头信息
    await isLogin();
    const token = await sdk.storage.getItem(`${APP_KEY}_token`);
    console.warn(token)
    if (config.url?.startsWith('/')) {
      config.url = baseUrl + config.url;
    }
    config.headers['authorization'] = token;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  async function (response: { data: any }) {
    try {

      // 在响应之前做一些处理
      const res = response.data;
      if (res.code === 200) {
        return res;
      }
      if (res.code === 1000052203) {
        await sdk.storage.removeItem(`${APP_KEY}_token`);
        await sdk.storage.removeItem(`${APP_KEY}_expire_time`);
        return res;
      }
      // 根据返回的业务错误码进行错误处理
      return Promise.reject(
        res.msg || res.error?.localizedMessage?.message || new Error(JSON.stringify(res)),
      );
    } catch (error) {
      // 对响应错误做些什么
      toastCallBack(error);
      return Promise.reject(error);
    }
  },
  function (error: Error) {
    // 对响应错误做些什么
    toastCallBack(error);
    return Promise.reject(error);
  },
);

export default request;