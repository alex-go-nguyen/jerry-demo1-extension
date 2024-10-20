import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, message, Modal } from 'antd'
import Search from 'antd/es/input/Search'

import { useBoolean } from '@/hooks'

import { AccountItem } from '@/components'

import { accountService } from '@/services'

import { IAccountInputData } from '@/interfaces'

import { IoIosAddCircle } from '@/utils/common'

export function Home() {
  const queryClient = useQueryClient()

  const { data: listAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return await accountService.getListAccounts()
    }
  })

  const { value: open, setTrue: setOpen, setFalse: setClose } = useBoolean(false)

  const [deleteAccountId, setDeleteAccountId] = useState<string>('')

  const onSearch = (data: string) => {
    console.log(data) // Handle search
  }

  const onChangeText = (data: string) => {
    console.log(data) // Handle onchangetext
  }
  const handleOpenFormCreateAccount = () => {
    chrome.runtime.sendMessage({ action: 'openForm' })
  }

  const { mutate, isPending } = useMutation({
    mutationFn: accountService.delete,
    onSuccess: () => {
      message.success('Delete account successful!')
      setClose()
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const handleDelete = () => {
    if (deleteAccountId) mutate(deleteAccountId)
  }

  const handleCancel = () => {
    setDeleteAccountId('')
    setClose()
  }

  return (
    <section>
      <Modal
        open={open}
        title='Title'
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button danger type='primary' onClick={handleDelete} loading={isPending}>
              Delete
            </Button>
          </>
        )}
      >
        <span>This account will be permanently removed from your vault.</span>
      </Modal>
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
            <AccountItem
              key={account.id}
              account={account}
              setOpen={setOpen}
              setDeleteAccountId={setDeleteAccountId}
              showAction
            />
          ))}
      </ul>
    </section>
  )
}
