export interface ILoginInputData {
  email: string
  password: string
}

export interface IResponseLoginData {
  token: string
  currentUser: {
    id: string
    email: string
  }
}
