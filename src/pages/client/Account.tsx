import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { Dropdown, MenuProps } from 'antd'

import { ICurrentUser } from '@/interfaces'

import {
  FaLanguage,
  FaUserAlt,
  getCurrentUser,
  IoLogOut,
  IoSettingsSharp,
  loadLanguageFromStorage,
  MdCheck,
  TbVersionsFilled
} from '@/utils/common'

export function Account() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()

  const { data: currentUser } = useQuery<ICurrentUser>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return await getCurrentUser()
    }
  })

  const [language, setLanguage] = useState<string>('en')

  const itemsLanguages: MenuProps['items'] = [
    {
      key: 'en',
      label: (
        <span className='flex justify-between items-center text-base font-normal'>
          {t('account.en')}
          {language === 'en' && (
            <span>
              <MdCheck className='text-green-500 text-xl' />
            </span>
          )}
        </span>
      )
    },
    {
      key: 'vi',
      label: (
        <span className='flex justify-between items-center text-base font-normal'>
          {t('account.vi')}
          {language === 'vi' && (
            <span>
              <MdCheck className='text-green-500 text-xl' />
            </span>
          )}
        </span>
      )
    }
  ]

  const handleLogout = () => {
    chrome.storage.local
      .clear()
      .then(() => {
        navigate('/login')
      })
      .catch((e) => console.error(e))
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    chrome.storage.sync.set({ language: lng })
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    changeLanguage(key)
    setLanguage(key)
  }
  useEffect(() => {
    const getLanguage = async () => {
      const savedLanguage = await loadLanguageFromStorage()
      setLanguage(savedLanguage)
    }
    getLanguage()
  }, [setLanguage])
  return (
    <section className='bg-radial-custom h-full'>
      <h2 className='flex items-center text-lg font-semibold bg-primary-800 text-white leading-[64px] px-2'>
        <span className='mr-2'>
          <FaUserAlt />
        </span>
        {currentUser?.email}
      </h2>

      <Dropdown
        menu={{ items: itemsLanguages, onClick }}
        trigger={['click']}
        className='block text-left text-lg text-slate-800 p-2 cursor-pointer hover:text-blue-antd'
      >
        <div className='flex items-center'>
          <span>
            <FaLanguage className='mr-2' />
          </span>
          {t('account.language')} ({language})
        </div>
      </Dropdown>

      <div>
        <a className='flex items-center text-lg text-slate-800 p-2'>
          <span>
            <TbVersionsFilled className='mr-2' />
          </span>
          {t('account.version')}
        </a>
      </div>
      <div>
        <a className='flex items-center text-lg text-slate-800 p-2'>
          <span>
            <IoSettingsSharp className='mr-2' />
          </span>
          {t('account.settings')}
        </a>
      </div>

      <button
        onClick={handleLogout}
        className='flex items-center w-full text-lg text-slate-800 p-2 hover:text-blue-antd'
      >
        <IoLogOut className='text-xl mr-2' />
        {t('account.logout')}
      </button>
    </section>
  )
}
