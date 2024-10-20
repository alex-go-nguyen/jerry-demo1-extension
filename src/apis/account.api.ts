import { instance as axiosClient } from '@/config'

import { ICreateAccountData, IUpdateAccountData } from '@/interfaces'

export const accountApi = {
  create: async (data: ICreateAccountData) => {
    return await axiosClient.post('/accounts/store', data)
  },
  getListAccounts: async () => {
    return await axiosClient.get('/accounts')
  },
  getAccountByUserIdAndAccountId: async (accountId: string) => {
    return await axiosClient.get(`/accounts/${accountId}`)
  },
  update: async (data: IUpdateAccountData) => {
    const { accountId, ...updateAccountData } = data
    return await axiosClient.put(`/accounts/update/${accountId}`, updateAccountData)
  },
  delete: async (accountId: string) => {
    return await axiosClient.delete(`/accounts/delete/${accountId}`)
  }
}
