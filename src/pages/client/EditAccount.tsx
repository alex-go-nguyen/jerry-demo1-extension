import { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { useMutation, useQuery } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { Form, Spin, message } from 'antd'

import { accountService } from '@/services'

import { ICreateAccountData } from '@/interfaces'

import { accountFields } from '@/utils/constant'
import { decryptPassword, IoMdClose } from '@/utils/common'

import { CustomBtn, CustomInput } from '@/components'

const editAccountSchema = yup.object().shape({
  username: yup.string().required('Please input your credential!'),
  password: yup.string().required('Please input your password!').min(8, 'Password needs to be at least 8 characters.'),
  domain: yup.string().required('Please input domain name!').default('')
})

export function EditAccount() {
  const { accountId } = useParams()
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(editAccountSchema)
  })

  const { data: accountData, isLoading } = useQuery<ICreateAccountData>({
    queryKey: ['account', accountId],
    queryFn: async () => {
      if (accountId) return accountService.getAccountByUserIdAndAccountId(accountId)
    }
  })

  useEffect(() => {
    setValue('username', accountData?.username || '')
    setValue('domain', accountData?.domain || '')
    setValue('password', decryptPassword(accountData?.password || '') || '')
  }, [accountData, setValue])

  const { mutate, isPending } = useMutation({
    mutationFn: accountService.update,
    onSuccess: () => {
      reset()
      message.success('Update account successful!')
    },
    onError: (e) => {
      chrome.storage.local.clear()
      message.error(e.message)
    }
  })

  const handleUpdateAccount = (data: ICreateAccountData) => {
    if (accountId) {
      mutate({ accountId, ...data })
    } else {
      message.error('Cannot find account id')
    }
  }

  const handleCloseForm = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id
      if (tabId) {
        chrome.tabs.remove(tabId)
      }
    })
  }

  return (
    <section className='flex h-screen'>
      <div className='relative flex flex-col box-border min-h-[188px] border border-[#d5d9de] m-auto rounded-[4px] shadow-[0_3px_9px_rgba(0,0,0,0.3)] w-2/5 min-w-[420px] bg-[#f7f9fc] p-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl text-primary-800 font-semibold'>Edit Account</h2>
          <span className='hover:bg-red-100 cursor-pointer' id='edit-account-form-close' onClick={handleCloseForm}>
            <IoMdClose className='text-3xl text-red-500 font-semibold ' />
          </span>
        </div>
        {isLoading ? (
          <Spin className='mt-8' />
        ) : (
          <Form
            className='bg-white mt-3 px-3 border border-gray-200'
            onFinish={handleSubmit(handleUpdateAccount)}
            layout='vertical'
          >
            {accountFields.map((field) => (
              <CustomInput
                key={field.name}
                name={field.name}
                size='large'
                label={field.label}
                control={control}
                errors={errors}
                placeholder={field.placeholder}
                prefixIcon={field.prefixIcon}
              />
            ))}

            <CustomBtn
              title='Save'
              type='primary'
              htmlType='submit'
              className='additional-custom-class'
              disabled={isPending}
              loading={isPending}
            />
          </Form>
        )}
      </div>
    </section>
  )
}
