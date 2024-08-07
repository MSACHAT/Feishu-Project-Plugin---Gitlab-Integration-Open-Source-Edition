import axios from "axios";



const baseUrl = requestHost;

interface ResWrapper<T = {}> {
  message: string;
  statusCode: number;
  data: T;
}
interface AuthRes {

  token: string;
  expireTime: string;
}

axios.interceptors.request.use(
  function (config) {
    config.headers['Content-Type'] = 'application/json';
    if (config.url?.startsWith('/')) {
      config.url = baseUrl + config.url;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }

)

axios.interceptors.response.use(
  function (response) {
    const statusCode =
      response.data?.status_code || response.data?.statusCode || response.data?.error?.code || 0;

    const errMsg =
      response?.data?.message ||
      response?.data?.msg ||
      response?.data?.error?.display_msg?.content ||
      response?.data?.error?.display_msg?.title;
    if (statusCode !== 0 && errMsg) {
      response.data = Object.assign(response.data, { errMsg });
      return Promise.reject(new Error(errMsg));
    }
    return response;
  },
  // 作为一个插件，如果报错，就捕获并上报，不要影响宿主业务
  // TODO: 错误上报
  function (error) {
    // TODO: 401，403
    return Promise.reject(error);
  },
);

export async function authAgree(code: string) {
  try {
    const res = await axios.post<ResWrapper<AuthRes>>(
      '/login',
      {
        code,
      },

    );
    return res.data;

  } catch (error) {
    console.error('Error during authAgree:', error);
    throw new Error('Failed to authenticate');
  }
}