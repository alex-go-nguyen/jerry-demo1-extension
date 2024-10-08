import { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { useMutation, useQuery } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { Button, Input, Spin, Typography, message } from 'antd'
import { MailOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons'

import { decryptPassword, IoMdClose } from '@/utils/common'

import { accountService } from '@/services'

import { ICreateAccountData } from '@/interfaces'

const { Text } = Typography

const editAccountSchema = yup.object().shape({
  username: yup.string().required('Please input your username!'),
  password: yup.string().min(8, 'Password needs to be at least 8 characters.').required('Please input your password!'),
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
          <h2 className='text-xl text-primary-500 font-semibold'>Edit Account</h2>
          <span className='hover:bg-red-100 cursor-pointer' id='edit-account-form-close' onClick={handleCloseForm}>
            <IoMdClose className='text-3xl text-red-500 font-semibold ' />
          </span>
        </div>
        {isLoading ? (
          <Spin className='mt-8' />
        ) : (
          <form className='bg-white mt-3 p-3 border border-gray-200' onSubmit={handleSubmit(handleUpdateAccount)}>
            <div>
              <label className='font-semibold'>Domain</label>
              <Controller
                name='domain'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size='large'
                    placeholder='Enter domain name'
                    type='text'
                    prefix={<GlobalOutlined />}
                    className='border-0 border-b-2 border-gray-400 hover:border-primary-800 focus:ring-0 focus:outline-none focus-within:shadow-none rounded-none px-0'
                  />
                )}
              />
              {errors.domain && <Text type='danger'>{errors.domain.message}</Text>}
            </div>

            <div className='mt-8'>
              <label className='font-semibold'>Username</label>
              <Controller
                name='username'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size='large'
                    placeholder='Enter your email address'
                    type='text'
                    prefix={<MailOutlined />}
                    className='border-0 border-b-2 border-gray-400 hover:border-primary-800 focus:ring-0 focus:outline-none focus-within:shadow-none rounded-none px-0'
                  />
                )}
              />
              {errors.username && <Text type='danger'>{errors.username.message}</Text>}
            </div>

            <div className='mt-8'>
              <label className='font-semibold'>Password</label>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size='large'
                    placeholder='Enter your Password'
                    prefix={<LockOutlined />}
                    className='border-0 border-b-2 border-gray-400 hover:border-primary-800 focus:ring-0 focus:outline-none focus-within:shadow-none rounded-none px-0'
                  />
                )}
              />
              {errors.password && <Text type='danger'>{errors.password.message}</Text>}
            </div>

            <Button
              type='primary'
              htmlType='submit'
              disabled={isPending}
              className='w-full h-12 mt-4 border-none font-bold rounded-md bg-primary-800 
            disabled:bg-primary-800 disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isPending ? <Spin className='text-rose-600' /> : 'Update password'}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
