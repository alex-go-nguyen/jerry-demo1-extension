import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { Button, Input, Spin, Typography, message } from 'antd'
import { MailOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons'

import { IoMdClose } from '@/utils/common'

import { accountApi } from '@/apis'

import { ICreateAccountData } from '@/interfaces'

const { Text } = Typography

const createAccountSchema = yup.object().shape({
  username: yup.string().required('Please input your username!'),
  password: yup.string().min(8, 'Password needs to be at least 8 characters.').required('Please input your password!'),
  domain: yup.string().required('Please input domain name!').default('')
})

export function CreateAccount() {
  const [currentDomain, setCurrentDomain] = useState('')

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0]?.url?.split('/')[2]
      if (currentUrl) {
        setCurrentDomain(currentUrl)
      }
    })
  }, [])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createAccountSchema)
  })

  useEffect(() => {
    setValue('domain', currentDomain)
  }, [currentDomain, setValue])

  const { mutate, isPending } = useMutation({
    mutationFn: accountApi.create,
    onSuccess: () => {
      reset()
      message.success('Save account successful!')
    },
    onError: (e) => {
      chrome.runtime.sendMessage({ action: 'closeForm' })
      chrome.runtime.sendMessage({ action: 'openPopup' })
      chrome.storage.local.clear()
      message.error(e.message)
    }
  })

  const handleSaveAccount = (data: ICreateAccountData) => {
    mutate(data)
  }

  const handleCloseForm = () => {
    chrome.runtime.sendMessage({ action: 'closeForm' })
  }

  return (
    <section className='transform translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.2,1.35,0.7,0.95)]'>
      <div className='relative flex flex-col box-border min-h-[188px] border border-[#d5d9de] rounded-[4px] shadow-[0_3px_9px_rgba(0,0,0,0.3)] my-[9px] mx-[6px] mb-[12px] w-[420px] bg-[#f7f9fc] p-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl text-primary-500 font-semibold'>Add to GOPass?</h2>
          <span className='hover:bg-red-100 cursor-pointer' id='create-account-form-close' onClick={handleCloseForm}>
            <IoMdClose className='text-3xl text-red-500 font-semibold ' />
          </span>
        </div>
        <form className='bg-white mt-3 p-3 border border-gray-200' onSubmit={handleSubmit(handleSaveAccount)}>
          <div className=''>
            <label className='font-semibold' htmlFor=''>
              Domain
            </label>
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
            <label className='font-semibold' htmlFor=''>
              Username
            </label>
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
            <label className='font-semibold' htmlFor=''>
              Password
            </label>

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
            {isPending ? <Spin className='text-rose-600' /> : 'Add password'}
          </Button>
        </form>
      </div>
    </section>
  )
}
