import { useQuery } from '@tanstack/react-query'

import { Button, Dropdown, message } from 'antd'
import type { MenuProps } from 'antd'

import Search from 'antd/es/input/Search'

import { accountService } from '@/services'

import { IAccountInputData } from '@/interfaces'

import { AiFillLock, decryptPassword, FaCopy, GrEdit, IoIosAddCircle, TbTrash, TfiMoreAlt } from '@/utils/common'

export function Home() {
  const { data: listAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return await accountService.getListAccounts()
    }
  })

  const onCopyClick = (key: string, account: IAccountInputData) => {
    if (key === 'username') {
      message.success('Copy username to clipboard')
      navigator.clipboard.writeText(account.username)
    } else if (key === 'password') {
      message.success('Copy password to clipboard')
      navigator.clipboard.writeText(decryptPassword(account.password))
    }
  }

  const onActionClick = (key: string, account: IAccountInputData) => {
    if (key === 'edit') {
      chrome.tabs.create({
        url: `index.html#/edit-account/${account.id}`
      })
    } else if (key === 'delete') {
      console.log(`Delete item of ${account.id}`)
    }
  }

  const createMenuItems = (account: IAccountInputData): MenuProps['items'] => [
    {
      key: 'username',
      label: <span>Copy username</span>,
      onClick: () => onCopyClick('username', account)
    },
    {
      key: 'password',
      label: <span>Copy password</span>,
      onClick: () => onCopyClick('password', account)
    }
  ]

  const createActionItems = (account: IAccountInputData): MenuProps['items'] => [
    {
      key: 'edit',
      label: (
        <span className='flex items-center text-green-500'>
          <GrEdit className='mr-2' />
          Edit
        </span>
      ),
      onClick: () => onActionClick('edit', account)
    },
    {
      key: 'delete',
      label: (
        <span className='flex items-center text-red-500'>
          <TbTrash className='mr-2' />
          Delete
        </span>
      ),
      onClick: () => onActionClick('delete', account)
    }
  ]

  const onSearch = (data: string) => {
    console.log(data)
  }

  const onChangeText = (data: string) => {
    console.log(data)
  }
  const handleOpenFormCreateAccount = () => {
    chrome.runtime.sendMessage({ action: 'openForm' })
  }

  return (
    <section>
      <div className='flex items-center border border-gray-300'>
        <Search
          className='p-2'
          placeholder='input search text'
          onSearch={onSearch}
          onChange={(e) => onChangeText(e.target.value)}
          enterButton
        />
        <Button className='bg-primary-500 text-white p-2'>Vault</Button>
        <Button className='border-none outline-none ml-2' onClick={handleOpenFormCreateAccount}>
          <IoIosAddCircle className='text-primary-800 text-2xl cursor-pointer' />
        </Button>
      </div>
      <h2 className='text-center text-primary-800 text-2xl'>Accounts available</h2>
      <ul>
        {listAccounts?.length > 0 &&
          listAccounts?.map((account: IAccountInputData) => (
            <li
              key={account.id}
              className='flex justify-between items-center border-b border-b-gray-300 transition group hover:bg-blue-50 hover:cursor-pointer'
            >
              <div className='flex flex-1 items-center p-2'>
                <span className='mr-3 cursor-pointer p-1 rounded-sm'>
                  <AiFillLock className='text-primary-800 text-3xl align-middle' />
                </span>
                <div className='relative text-left'>
                  <span className='transition-all duration-500 text-gray-500 text-left opacity-100 group-hover:opacity-0 group-hover:transform group-hover:translate-y-2'>
                    {account.domain}
                  </span>

                  <span className='absolute top-0 left-0 transition-all duration-500 text-sm font-bold opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-primary-500'>
                    Launch
                  </span>
                  <div className='text-left text-base font-medium text-gray-600'>{account.username}</div>
                </div>
              </div>
              <div className='flex p-2 transition'>
                <Dropdown menu={{ items: createMenuItems(account) }} placement='bottomRight' arrow>
                  <Button className='bg-none outline-none border-none cursor-pointer mr-2'>
                    <FaCopy className='text-primary-500 text-lg' />
                  </Button>
                </Dropdown>

                <Dropdown menu={{ items: createActionItems(account) }} placement='bottomRight' arrow>
                  <Button className='bg-none outline-none border-none cursor-pointer'>
                    <TfiMoreAlt className='text-primary-500 text-lg' />
                  </Button>
                </Dropdown>
              </div>
            </li>
          ))}
      </ul>
    </section>
  )
}
