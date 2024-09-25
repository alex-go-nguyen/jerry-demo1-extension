import { IoHome, TbShieldLockFilled, IoNotifications, FaUserAlt } from '@/utils/common'

export const bottomTabList = [
  {
    title: 'Home',
    icon: <IoHome/>,
    to: '/'
  },
  {
    title: 'Generator',
    icon: <TbShieldLockFilled/>,
    to: '/generator'
  },
  {
    title: 'Alerts',
    icon: <IoNotifications/>,
    to: '/alert'
  },
  {
    title: 'Account',
    icon: <FaUserAlt/>,
    to: '/account'
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
