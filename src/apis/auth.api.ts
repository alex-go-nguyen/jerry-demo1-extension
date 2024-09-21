import { instance as axiosClient } from '@/config'

import { ILoginInputData } from '@/interfaces'

export const apiLogin = async (userData: ILoginInputData) => {
  const response = await axiosClient.post('/auth/login', userData)
  return response
}

export const apiLogout = async () => {
  const response = await axiosClient.post('/auth/logout')
  return response
}
