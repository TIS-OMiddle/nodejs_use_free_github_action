import axios, { AxiosRequestConfig } from "axios"
import { sendDefaultMail } from "./mail";

export function request<T = any>(config: AxiosRequestConfig) {
  return axios(config).then(res => res.data) as unknown as T
}

export function requestCookies(config: AxiosRequestConfig) {
  return axios(config).then(res => res.headers['set-cookie'])
}

export async function execute(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err) {
    sendDefaultMail({
      subject: `[${name}]执行失败`,
      text: JSON.stringify(err)
    })
  }
}