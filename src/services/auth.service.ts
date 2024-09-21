import * as authApi from '@/apis'

type loginData = {
  email: string
  password: string
}

export const loginService = async (loginData: loginData) => {
  const response = await authApi.apiLogin(loginData)
  return response.data
}

export const logoutService = async () => {
  const response = await authApi.apiLogout()
  return response.data
}
