import {
  IoHome,
  TbShieldLockFilled,
  FaUserAlt,
  BiSolidKey,
  IoIosArrowForward,
  FaVault,
  LuArrowUpRight,
  IoSettingsSharp,
  BsPersonWorkspace
} from '@/utils/common'

export const bottomTabList = [
  {
    title: 'Home',
    icon: <IoHome />,
    to: '/'
  },
  {
    title: 'Generator',
    icon: <TbShieldLockFilled />,
    to: '/generator'
  },
  {
    title: 'Workspace',
    icon: <BsPersonWorkspace />,
    to: '/workspace'
  },
  {
    title: 'Account',
    icon: <FaUserAlt />,
    to: '/account'
  }
]

export const listMoreOptions = [
  {
    key: 'generate',
    text: 'Generate a password',
    iconLeft: <BiSolidKey />,
    iconRight: <IoIosArrowForward />
  },
  {
    key: 'open',
    text: 'Open my vault',
    iconLeft: <FaVault />,
    iconRight: <LuArrowUpRight />
  },
  {
    key: 'setting',
    text: 'Settings',
    iconLeft: <IoSettingsSharp />,
    iconRight: <LuArrowUpRight />
  }
]

export const passwordSettingOptions = [
  {
    key: 'lowercase',
    text: 'Lowercase (a-z)'
  },
  {
    key: 'uppercase',
    text: 'Uppercase (A-Z)'
  },
  {
    key: 'numbers',
    text: 'Numbers (0-9)'
  },
  {
    key: 'symbols',
    text: 'Symbols ($#*)'
  }
]

export const localStorageKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  currentUser: 'currentUser'
}

export const authFields = [
  {
    label: 'Email',
    name: 'email',
    placeholder: 'Enter your email'
  },
  {
    label: 'Password',
    name: 'password',
    placeholder: 'Enter your password'
  }
]

export const environmentConfig = {
  clientUrl: import.meta.env.VITE_CLIENT_URL,
  apiUrl: import.meta.env.VITE_API_URL,
  apiUrlRefreshToken: import.meta.env.VITE_API_URL_REFRESH_TOKEN,
  encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY,
  encryptionKeyIV: import.meta.env.VITE_ENCRYPTION_IV,
  sentryUrl: import.meta.env.VITE_SENTRY_URL
}

export const accountFields = [
  {
    label: 'Domain',
    name: 'domain',
    type: 'text',
    placeholder: 'domainPlaceholder'
  },
  {
    label: 'Credential',
    name: 'username',
    type: 'text',
    placeholder: 'credentialPlaceholder'
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'passwordPlaceholder'
  }
]

export const languages = {
  en: { nativeName: 'English' },
  vi: { nativeName: 'Vietnamese' }
}
