import React from 'react'

import { Button, Dropdown, MenuProps, message } from 'antd'

import { IAccountInputData } from '@/interfaces'
import { AiFillLock, decryptPassword, FaCopy, GrEdit, TbTrash, TfiMoreAlt } from '@/utils/common'

type AccountItemProps = {
  account: IAccountInputData
  showAction: boolean
  setOpen?: () => void
  setDeleteAccountId?: React.Dispatch<React.SetStateAction<string>>
}

export const AccountItem: React.FC<AccountItemProps> = ({ account, showAction, setOpen, setDeleteAccountId }) => {
  const onCopyClick = (key: string, account: IAccountInputData) => {
    if (key === 'username') {
      message.success('Copy username to clipboard')
      navigator.clipboard.writeText(account.username)
    } else if (key === 'password') {
      message.success('Copy password to clipboard')
      navigator.clipboard.writeText(decryptPassword(account.password))
    }
  }

  const onActionAccountClick = (key: string, account: IAccountInputData) => {
    if (key === 'edit') {
      chrome.tabs.create({
        url: `index.html#/edit-account/${account.id}`
      })
    } else if (key === 'delete') {
      if (setOpen && setDeleteAccountId) {
        setOpen()
        setDeleteAccountId(account.id)
      }
    }
  }

  const createMenuItems = (account: IAccountInputData): MenuProps['items'] => [
    {
      key: 'username',
      label: <span className='text-lg font-normal'>Copy username</span>,
      onClick: (e) => {
        e.domEvent.stopPropagation()
        onCopyClick('username', account)
      }
    },
    {
      key: 'password',
      label: <span className='text-lg font-normal'>Copy password</span>,
      onClick: (e) => {
        e.domEvent.stopPropagation()
        onCopyClick('password', account)
      }
    }
  ]

  const createActionAccount = (data: IAccountInputData): MenuProps['items'] => [
    {
      key: 'edit',
      label: (
        <span className='flex items-center text-slate-700 text-lg font-normal'>
          <GrEdit className='mr-2' />
          Edit
        </span>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation()
        onActionAccountClick('edit', data)
      }
    },
    {
      key: 'delete',
      label: (
        <span className='flex items-center text-red-500 text-lg font-normal'>
          <TbTrash className='mr-2' />
          Delete
        </span>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation()
        onActionAccountClick('delete', data)
      }
    }
  ]
  const handleOpenSite = (siteUrl: string) => () => {
    window.open(`https://${siteUrl}`)
  }
  return (
    <li
      key={account.id}
      className='flex justify-between items-center border-b border-b-gray-300 transition group hover:bg-blue-50 hover:cursor-pointer'
    >
      <div className='flex flex-1 items-center p-2' onClick={handleOpenSite(account.domain)}>
        <span className='mr-3 cursor-pointer p-1 rounded-sm'>
          <AiFillLock className='text-primary-800 text-3xl align-middle' />
        </span>
        <div className='relative text-left'>
          <span className='transition-all duration-500 text-slate-600 text-left text-base opacity-100 group-hover:opacity-0 group-hover:transform group-hover:translate-y-2'>
            {account.domain}
          </span>

          <span className='absolute top-0 left-0 transition-all duration-300 text-base font-bold opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-primary-500'>
            Launch
          </span>
          <div className='text-left text-lg font-medium text-slate-700'>{account.username}</div>
        </div>
      </div>
      <div className='flex p-2 transition'>
        <Dropdown menu={{ items: createMenuItems(account) }} placement='bottomRight' arrow>
          <Button className='bg-none outline-none border-none cursor-pointer mr-2'>
            <FaCopy className='text-primary-500 text-lg' />
          </Button>
        </Dropdown>
        {showAction && (
          <Dropdown menu={{ items: createActionAccount(account) }} placement='bottomRight' arrow>
            <Button className='bg-none outline-none border-none cursor-pointer'>
              <TfiMoreAlt className='text-primary-500 text-lg' />
            </Button>
          </Dropdown>
        )}
      </div>
    </li>
  )
}
