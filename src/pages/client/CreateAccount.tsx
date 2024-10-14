import { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { Form, message } from 'antd'

import { accountApi } from '@/apis'

import { ICreateAccountData } from '@/interfaces'

import { IoMdClose } from '@/utils/common'
import { accountFields } from '@/utils/constant'

import { CustomBtn, CustomInput } from '@/components'

const createAccountSchema = yup.object().shape({
  username: yup.string().required('Please input your credential!'),
  password: yup.string().min(8, 'Password needs to be at least 8 characters.').required('Please input your password!'),
  domain: yup.string().required('Please input domain name!').default('')
})

export function CreateAccount() {
  const queryClient = useQueryClient()

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
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
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
    <section className=''>
      <div className='relative flex flex-col box-border min-h-[188px] border border-[#d5d9de] rounded-[4px] shadow-[0_3px_9px_rgba(0,0,0,0.3)] my-[9px] mx-[6px] mb-[12px] w-[420px] bg-[#f7f9fc] p-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl text-primary-800 font-semibold'>Add to GoPass?</h2>
          <span
            className='hover:bg-red-100 hover:text-red-500 cursor-pointer '
            id='create-account-form-close'
            onClick={handleCloseForm}
          >
            <IoMdClose className='text-3xl text-gray-500 font-semibold' />
          </span>
        </div>
        <Form
          className='bg-white mt-3 px-3 border border-gray-200 pb-3'
          onFinish={handleSubmit(handleSaveAccount)}
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
            />
          ))}

          <CustomBtn title='Save' type='primary' htmlType='submit' disabled={isPending} loading={isPending} />
        </Form>
      </div>
    </section>
  )
}
