import { instance as axiosClient } from '@/config'
import { IWorkspaceInputData, IWorkspaceUpdateData } from '@/interfaces'

export const workspaceApi = {
  create: async (createWorkspaceData: IWorkspaceInputData) => {
    const response = await axiosClient.post('/workspaces/create', createWorkspaceData)
    return response.data
  },

  getAll: async () => {
    const response = await axiosClient.get('/workspaces')
    return response.data
  },
  update: async (updateWorkspaceData: IWorkspaceUpdateData) => {
    const response = await axiosClient.put(`/workspaces/update/${updateWorkspaceData.id}`, updateWorkspaceData)
    return response.data
  },

  softDelete: async (workspaceId: string) => {
    const response = await axiosClient.delete(`/workspaces/soft-delete/${workspaceId}`)
    return response.data
  }
}
