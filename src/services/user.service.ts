import { userApi } from '@/apis'

export const userService = {
  getCurrentUser: async () => {
    const response = await userApi.getCurrentUser()
    return response.data
  }
}
