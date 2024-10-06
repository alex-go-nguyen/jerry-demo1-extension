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
  async function (error) {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { refreshToken } = await chrome.storage.local.get(localStorageKeys.refreshToken)

        const response = await axios.post(`${import.meta.env.VITE_API_URL_REFRESH_TOKEN}`, {
          refreshToken
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        chrome.storage.local.set({ accessToken })
        chrome.storage.local.set({ refreshToken: newRefreshToken })

        instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        return instance(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        chrome.storage.local.clear()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
