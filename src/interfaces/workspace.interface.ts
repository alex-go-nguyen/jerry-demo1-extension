import { IAccountInputData, ICurrentUser } from './account.interface'

export interface IWorkspaceInputData {
  name: string
  accounts: IAccountInputData[]
}

export interface IWorkspaceData extends IWorkspaceInputData {
  id: string
  owner: Omit<ICurrentUser, 'email'>
}

export interface IWorkspaceUpdateData extends IWorkspaceInputData {
  id: string
}

export interface IWorkspaceShareData {
  workspaceId?: string | undefined;
  emails?: (string | undefined)[] | undefined;
}
