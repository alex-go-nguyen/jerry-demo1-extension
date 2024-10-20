import * as CryptoJS from 'crypto-js'
import { environmentConfig } from '../constant'

export const decryptPassword = (encryptedPassword: string): string => {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedPassword,
    CryptoJS.enc.Utf8.parse(environmentConfig.encryptionKey),
    {
      iv: CryptoJS.enc.Utf8.parse(environmentConfig.encryptionKeyIV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}
