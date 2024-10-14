import { useNavigate } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import { Dropdown, MenuProps, message, Space } from 'antd'

import { ICurrentUser } from '@/interfaces'

import { FaLanguage, FaUserAlt, getCurrentUser, IoLogOut, IoSettingsSharp, TbVersionsFilled } from '@/utils/common'

const itemsLanguages: MenuProps['items'] = [
  {
    key: 'English',
    label: <span>English</span>
  },
  {
    key: 'Vietnamese',
    label: <span>Vietnamese</span>
  }
]

export function Account() {
  const navigate = useNavigate()

  const { data: currentUser } = useQuery<ICurrentUser>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return await getCurrentUser()
    }
  })

  const handleLogout = () => {
    chrome.storage.local
      .clear()
      .then(() => {
        navigate('/login')
      })
      .catch((e) => console.error(e))
  }
  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`)
  }

  return (
    <section className='bg-radial-custom h-full'>
      <h2 className='flex items-center text-lg font-semibold bg-primary-800 text-white leading-[64px] px-2'>
        <span className='mr-2'>
          <FaUserAlt />
        </span>
        {currentUser?.email}
      </h2>
      <div></div>

      <Dropdown
        menu={{ items: itemsLanguages, onClick }}
        trigger={['click']}
        className='block text-left text-lg text-slate-800 p-2 cursor-pointer hover:text-blue-antd'
      >
        <Space className='flex'>
          <span>
            <FaLanguage />
          </span>
          Languages(en)
        </Space>
      </Dropdown>

      <div>
        <a className='flex items-center text-lg text-slate-800 p-2'>
          <span>
            <TbVersionsFilled className='mr-2' />
          </span>
          Version (1.0.0)
        </a>
      </div>
      <div>
        <a className='flex items-center text-lg text-slate-800 p-2'>
          <span>
            <IoSettingsSharp className='mr-2' />
          </span>
          Settings
        </a>
      </div>

      <button
        onClick={handleLogout}
        className='flex items-center w-full text-lg text-slate-800 p-2 hover:text-blue-antd'
      >
        <IoLogOut className='text-xl mr-2' />
        Log out
      </button>
    </section>
  )
}
