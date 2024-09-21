export interface ILoginInputData {
  email: string
  password: string
}

export interface IResponseLoginData {
  token: string
  currentUser: {
    us_id: string
    us_email: string
  }
}
