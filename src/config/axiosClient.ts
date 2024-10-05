import axios from 'axios'

import { localStorageKeys } from '@/utils/constant'

export const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`
})

instance.interceptors.request.use(
  async function (config) {
    const result = await chrome.storage.local.get(localStorageKeys.accessToken)
    config.headers.Authorization = `Bearer ${result[localStorageKeys.accessToken]}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
