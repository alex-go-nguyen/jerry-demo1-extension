import { instance as axiosClient } from '@/config'

import { ILoginInputData } from '@/interfaces'

export const authApi = {
  login: async (userData: ILoginInputData) => {
    const response = await axiosClient.post('/auth/login', userData)
    return response.data
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout')
    return response.data
  }
}
