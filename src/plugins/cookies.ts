'use strict';
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
export const getCookie = (keyName: string) => { return cookies.get(keyName); }
export const setCookie = (keyName: string, value: string, expireTimes?: string | number | Date | undefined, path?: string | undefined, domain?: string | undefined, secure?: boolean | undefined, sameSite?: string | undefined) => {
  cookies.set(keyName, value, expireTimes, path, domain, secure, sameSite);
}
export const removeCookie = (keyName: string, path?: string | undefined, domain?: string | undefined) => {
  cookies.remove(keyName, path, domain);
}