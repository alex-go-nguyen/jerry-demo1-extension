import { instance as axiosClient } from '@/config'

export const userApi = {
  getCurrentUser: async () => {
    return await axiosClient.get('/users/currentUser')
  }
}
