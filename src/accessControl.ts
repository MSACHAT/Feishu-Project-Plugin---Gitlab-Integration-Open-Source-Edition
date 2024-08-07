import { authAgree } from "./api";
import { APP_KEY } from "./constants";

const sdk = window.JSSDK;

async function getToken(code: string) {
  try {
    const res = await authAgree(code);

    if (!res || !res.data) {

      return Promise.reject(new Error('Invalid response from authAgree'));
    }
    const { token, expireTime } = res.data;

    if (!token || !expireTime) {

      return Promise.reject(new Error('Token or expireTime is missing'));
    }
    await sdk.storage.setItem(`${APP_KEY}_token`, token);
    await sdk.storage.setItem(`${APP_KEY}_expire_time`, expireTime);

    Promise.resolve(true);
  } catch (error) {
    Promise.reject(error);
  }

}




async function checkLogin() {
  const token = sdk.storage.getItem(`${APP_KEY}_token`);
  const expireTimeStr = sdk.storage.getItem(`${APP_KEY}_expire_time`);

  if (!token || !expireTimeStr) {
    return false;
  }

  const expireTime = Number(expireTimeStr);
  if (isNaN(expireTime) || expireTime - Date.now() <= 0) {
    return false;
  }

  return true;
}



export async function isLogin() {
  const login = await checkLogin();
  if (!login) {
    const code = await sdk.utils.getAuthCode();
    getToken(code.code);
  }
}