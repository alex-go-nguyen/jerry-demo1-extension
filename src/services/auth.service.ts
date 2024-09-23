import { authApi } from '@/apis'

type loginData = {
  email: string
  password: string
}

export const authService = {
  login: async (loginData: loginData) => {
    const response = await authApi.login(loginData)
    return response.data
  },

  logout: async () => {
    const response = await authApi.logout()
    return response.data
  }
}
