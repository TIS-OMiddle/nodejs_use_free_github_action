import axios, { AxiosRequestConfig } from "axios"

export function request<T = any>(config: AxiosRequestConfig) {
  return axios(config).then(res => res.data) as unknown as T
}

export function requestCookies(config: AxiosRequestConfig) {
  return axios(config).then(res => res.headers['set-cookie'])
}