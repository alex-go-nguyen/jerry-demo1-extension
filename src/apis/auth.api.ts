import { instance as axiosClient } from '@/config'
import { ILoginInputData } from '@/interfaces'

export const authApi = {
  login: async (userData: ILoginInputData) => {
    return await axiosClient.post('/auth/login', userData)
  },

  logout: async () => {
    return await axiosClient.post('/auth/logout')
  }
}
