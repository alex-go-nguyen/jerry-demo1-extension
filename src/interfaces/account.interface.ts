export interface ICreateAccountData {
  username: string
  password: string
  domain: string
}
export interface IAccountInputData {
  id: string
  username: string
  password: string
  domain: string
}

export interface ICurrentUser {
  id: string
  name: string
  email: string
}

export interface IUpdateAccountData extends ICreateAccountData {
  accountId: string
}
