import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { Form, message } from 'antd'

import { accountApi } from '@/apis'

import { IAccountInputData, ICreateAccountData } from '@/interfaces'

import { accountService } from '@/services'

import { IoMdClose } from '@/utils/common'
import { accountFields } from '@/utils/constant'

import { CustomBtn, CustomInput } from '@/components'

type RequestActionSavingAccount = {
  action: string
  credential: string
  password: string
  domain: string
}

export function CreateAccount() {
  const { t } = useTranslation()

  const createAccountSchema = yup.object().shape({
    username: yup.string().required(t('createAccount.credentialRequire')),
    password: yup.string().required(t('createAccount.passwordRequire')),
    domain: yup.string().required(t('createAccount.domainRequire')).default('')
  })

  const queryClient = useQueryClient()

  const { data: listAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return await accountService.getListAccounts()
    }
  })

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

  useEffect(() => {
    const handleMessage = (request: RequestActionSavingAccount) => {
      if (request.action === 'formSubmit') {
        const { credential, password, domain } = request
        const isExisted = listAccounts.find(
          (account: IAccountInputData) => account.domain === domain && account.username === credential
        )

        if (!isExisted) {
          setValue('username', credential)
          setValue('password', password)
          chrome.runtime.sendMessage({ action: 'openForm' })
        } else {
          chrome.runtime.sendMessage({ action: 'closeForm' })
        }
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: accountApi.create,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      message.success(t('createAccount.saveAccountSuccess'))
    },
    onError: (e) => {
      chrome.runtime.sendMessage({ action: 'closeForm' })
      chrome.runtime.sendMessage({ action: 'openPopup' })
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
    <section>
      <div className='relative flex flex-col box-border min-h-[188px] border border-[#d5d9de] rounded-[4px] shadow-[0_3px_9px_rgba(0,0,0,0.3)] my-[9px] mx-[6px] mb-[12px] w-[420px] bg-[#f7f9fc] p-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl text-primary-800 font-semibold'>{t('createAccount.title')}</h2>
          <button
            className='hover:bg-gray-300 cursor-pointer '
            id='create-account-form-close'
            onClick={handleCloseForm}
          >
            <IoMdClose className='text-3xl text-gray-600 font-semibold' />
          </button>
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
              type={field.type}
              label={t(`createAccount.${field.name}`)}
              control={control}
              errors={errors}
              placeholder={t(`createAccount.${field.placeholder}`)}
            />
          ))}

          <CustomBtn
            title={t('createAccount.saveBtn')}
            type='primary'
            htmlType='submit'
            disabled={isPending}
            loading={isPending}
          />
        </Form>
      </div>
    </section>
  )
}
