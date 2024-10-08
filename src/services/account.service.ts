import { accountApi } from '@/apis'

import { ICreateAccountData, IUpdateAccountData } from '@/interfaces'

export const accountService = {
  create: async (data: ICreateAccountData) => {
    const response = await accountApi.create(data)
    return response.data
  },
  getListAccounts: async () => {
    const response = await accountApi.getListAccounts()
    return response.data
  },
  getAccountByUserIdAndAccountId: async (accountId: string) => {
    const response = await accountApi.getAccountByUserIdAndAccountId(accountId)
    return response.data
  },
  update: async (data: IUpdateAccountData) => {
    const response = await accountApi.update(data)
    return response.data
  },
  delete: async (accountId: string) => {
    const response = await accountApi.delete(accountId)
    return response.data
  }
}
