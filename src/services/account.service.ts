import { accountApi } from '@/apis'

import { ICreateAccountData } from '@/interfaces'

export const accountService = {
  create: async (data: ICreateAccountData) => {
    const response = await accountApi.create(data)
    return response.data
  },
  getListAccounts: async () => {
    const response = await accountApi.getListAccounts()
    return response.data
  }
}
