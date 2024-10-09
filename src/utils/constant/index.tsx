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
