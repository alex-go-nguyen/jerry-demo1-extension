import { instance as axiosClient } from '@/config'
import { IWorkspaceShareData } from '@/interfaces'

export const workspaceSharingApi = {
  create: async (shareInputData: IWorkspaceShareData) => {
    const response = await axiosClient.post('sharing-workspace/create', shareInputData)
    return response.data
  }
}
