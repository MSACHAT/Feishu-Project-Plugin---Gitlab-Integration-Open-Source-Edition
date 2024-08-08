import { authAgree } from "./api";
import { APP_KEY } from "./constants";

const sdk = window.JSSDK;

async function getToken(code: string) {
  try {
    const res = await authAgree(code) as unknown as {token:string,expire_time:number};
    console.log("RES",res)
    if (!res) {

      return Promise.reject(new Error('Invalid response from authAgree'));
    }
    const { token, expire_time } = res;

    if (!token || !expire_time) {

      return Promise.reject(new Error('Token or expireTime is missing'));
    }
    await sdk.storage.setItem(`${APP_KEY}_token`, token);
    await sdk.storage.setItem(`${APP_KEY}_expire_time`, expire_time.toString());

    Promise.resolve(true);
  } catch (error) {
    Promise.reject(error);
  }

}




async function checkLogin() {
  const token = await sdk.storage.getItem(`${APP_KEY}_token`);
  const expireTimeStr = await sdk.storage.getItem(`${APP_KEY}_expire_time`);
console.log("asidhasoidhasd")
  if (!token || !expireTimeStr) {
    return false;
  }

  const expireTime = Number(expireTimeStr);
  if ( isNaN(expireTime) || (expireTime <= 0)) {
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