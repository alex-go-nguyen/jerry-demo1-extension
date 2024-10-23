import { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

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

export function EditAccount() {
  const { t } = useTranslation()
  const editAccountSchema = yup.object().shape({
    username: yup.string().required(t('editAccount.usernameRequire')),
    password: yup.string().required(t('editAccount.passwordRequire')),
    domain: yup.string().required(t('domainRequire')).default('')
  })
  const { accountId } = useParams()
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty }
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
      message.success(t('editAccount.updateSuccess'))
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const handleUpdateAccount = (data: ICreateAccountData) => {
    if (accountId) {
      mutate({ accountId, ...data })
    } else {
      message.error(t('editAccount.errorAccountId'))
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
          <h2 className='text-xl text-primary-800 font-semibold'>{t('editAccount.title')}</h2>
          <button className='hover:bg-gray-300 cursor-pointer' id='edit-account-form-close' onClick={handleCloseForm}>
            <IoMdClose className='text-3xl text-gray-600 font-semibold ' />
          </button>
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
                type={field.type}
                label={t(`createAccount.${field.name}`)}
                control={control}
                errors={errors}
                placeholder={t(`createAccount.${field.placeholder}`)}
              />
            ))}

            <CustomBtn
              title={t('editAccount.update')}
              type='primary'
              htmlType='submit'
              className='additional-custom-class'
              disabled={isPending || !isDirty}
              loading={isPending}
            />
          </Form>
        )}
      </div>
    </section>
  )
}
