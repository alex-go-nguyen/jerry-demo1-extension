import { IoHome, TbShieldLockFilled, IoNotifications, FaUserAlt } from '@/utils'

export const bottomTabList = [
  {
    title: 'Home',
    Icon: IoHome,
    to: '/'
  },
  {
    title: 'Generator',
    Icon: TbShieldLockFilled,
    to: '/generator'
  },
  {
    title: 'Alerts',
    Icon: IoNotifications,
    to: '/alert'
  },
  {
    title: 'Account',
    Icon: FaUserAlt,
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
