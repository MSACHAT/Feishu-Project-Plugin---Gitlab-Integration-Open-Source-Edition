import { authAgree } from "./api";
import { APP_KEY } from "./constants";

const sdk = window.JSSDK;

async function getToken(code: string) {
  try {
    const res = await authAgree(code) as unknown as { token: string, expire_time: number };
    console.log("RES", res)
    if (!res) {

      return Promise.reject(new Error('Invalid response from authAgree'));
    }
    const { token, expire_time } = res;

    if (!token || !expire_time) {

      return Promise.reject(new Error('Token or expireTime is missing'));

    }
    const currentTime = Date.now();



    const adjustedExpireTime = currentTime + (7200 * 1000) - 1 * 60 * 1000;

    await sdk.storage.setItem(`${APP_KEY}_token`, token);
    await sdk.storage.setItem(`${APP_KEY}_expire_time`, adjustedExpireTime.toString());

    Promise.resolve(true);
  } catch (error) {
    Promise.reject(error);
  }

}




async function checkLogin() {
  const token = await sdk.storage.getItem(`${APP_KEY}_token`);
  const expireTimeStr = await sdk.storage.getItem(`${APP_KEY}_expire_time`);

  const currentTime = Date.now();


  if (!token || !expireTimeStr) {
    return false;
  }

  const expireTime = Number(expireTimeStr);
  return !(isNaN(expireTime) || (expireTime - currentTime) <= 0);


}



export async function isLogin() {
  const login = await checkLogin();
  if (!login) {
    const code = await sdk.utils.getAuthCode();
    getToken(code.code);
  }
}