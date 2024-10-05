export interface ICreateAccountData {
  username: string
  password: string
  domain: string
}

export interface ICreateAccountProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
