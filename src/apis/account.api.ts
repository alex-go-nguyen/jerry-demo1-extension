import { instance as axiosClient } from '@/config'

import { ICreateAccountData } from '@/interfaces'

export const accountApi = {
  create: async (data: ICreateAccountData) => {
    const response = await axiosClient.post('accounts/store', data)
    return response.data
  }
}
