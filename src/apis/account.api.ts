import { instance as axiosClient } from '@/config'

import { ICreateAccountData } from '@/interfaces'

export const accountApi = {
  create: async (data: ICreateAccountData) => {
    return await axiosClient.post('/accounts/store', data)
  },
  getListAccounts: async () => {
    return await axiosClient.get('/accounts')
  }
}

