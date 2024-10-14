import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, message, Modal } from 'antd'

import { useBoolean } from '@/hooks'

import { accountService } from '@/services'

import { IAccountInputData } from '@/interfaces'

import { AccountItem, CustomBtn, CustomInput } from '@/components'

import { MdAdd } from '@/utils/common'

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

  const [listSuggestAccounts, setListSuggestAccounts] = useState<IAccountInputData[]>([])

  const handleOpenFormCreateAccount = () => {
    chrome.runtime.sendMessage({ action: 'openForm' }, () => {
      window.close()
    })
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

  useEffect(() => {
    setListSuggestAccounts(listAccounts)
  }, [listAccounts])

  const handleDelete = () => {
    if (deleteAccountId) mutate(deleteAccountId)
  }

  const handleCancel = () => {
    setDeleteAccountId('')
    setClose()
  }

  const handleSearchAccount = (searchValue: string) => {
    const newSuggestAccounts = listAccounts.filter(
      (account: IAccountInputData) => account.domain.includes(searchValue) || account.username.includes(searchValue)
    )
    setListSuggestAccounts(newSuggestAccounts)
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
      <div className='flex items-center py-3 border border-gray-300'>
        <CustomInput
          name='searchValue'
          size='large'
          placeholder='Search account'
          className='text-lg font-medium mx-2 border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom'
          onChange={(e: { target: { value: string } }) => handleSearchAccount(e.target.value)}
        />
        <CustomBtn
          title='Add'
          type='primary'
          className='!mt-0 !w-[100px] !h-11 mr-2'
          children={<MdAdd className='text-2xl' />}
          onClick={handleOpenFormCreateAccount}
        />
      </div>
      <h2 className='text-center text-primary-800 text-2xl font-medium pt-3 py-2'>Your accounts</h2>
      <ul>
        {listSuggestAccounts?.length > 0 ? (
          listSuggestAccounts?.map((account: IAccountInputData) => (
            <AccountItem
              key={account.id}
              account={account}
              setOpen={setOpen}
              setDeleteAccountId={setDeleteAccountId}
              showAction
            />
          ))
        ) : (
          <li className='text-slate-700 text-lg'>No accounts founded</li>
        )}
      </ul>
    </section>
  )
}
