import { Link, useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { useMutation } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { Form, message } from 'antd'

import { authApi } from '@/apis'

import { useChromeStorage } from '@/hooks'

import { ILoginInputData } from '@/interfaces'

import { CustomBtn, CustomInput } from '@/components'

import { authFields, environmentConfig, localStorageKeys } from '@/utils/constant'

export function Login() {
  const { t } = useTranslation()

  const schema = yup.object().shape({
    email: yup.string().email(t('login.emailValid')).required(t('login.emailRequired')),
    password: yup.string().min(8, t('login.passwordMin')).required(t('login.passwordRequire'))
  })

  const navigate = useNavigate()

  const { setValue: setAccessToken } = useChromeStorage<string>(localStorageKeys.accessToken)
  const { setValue: setRefreshToken } = useChromeStorage<string>(localStorageKeys.refreshToken)
  const { setValue: setCurrentUser } = useChromeStorage<object>(localStorageKeys.currentUser)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ILoginInputData) => {
      return await authApi.login(data)
    },
    onSuccess: ({ accessToken, refreshToken, currentUser }) => {
      setAccessToken(accessToken)
      setCurrentUser(currentUser)
      setRefreshToken(refreshToken)
      message.success(t('login.loginSuccess'))
      navigate('/')
    },
    onError: (e) => {
      message.error(t('login.loginFailed') + e.message)
    }
  })

  const handleLogin = (data: ILoginInputData) => {
    mutate(data)
  }

  return (
    <section className='flex justify-center bg-white'>
      <div className='mb-auto bg-white round-md p-8 xl:w-[30%] lg:w-auto lg:mt-5 shadow-xl border border-gray-100 w-full'>
        <h1 className='text-3xl font-semibold mb-4'>{t('login.title')}</h1>
        <span className='text-lg'>{t('login.noAccount')}</span> <br />
        <span className='text-lg inline-block mr-2'>{t('login.youCan')}</span>
        <a
          href={`${environmentConfig.clientUrl}/register`}
          target='_blank'
          className='text-lg text-blue-500 font-semibold hover:underline'
        >
          {t('login.register')}
        </a>
        <Form className='mt-6' onFinish={handleSubmit(handleLogin)} layout='vertical'>
          {authFields.map((field) => {
            if (field.name === 'email' || field.name === 'password')
              return (
                <CustomInput
                  key={field.name}
                  name={field.name}
                  size='large'
                  type={field.name === 'password' ? 'password' : 'text'}
                  label={field.label}
                  control={control}
                  errors={errors}
                  placeholder={field.name === 'email' ? t('login.emailPlaceholder') : t('login.passwordPlaceholder')}
                />
              )
          })}
          <button className='w-full text-right text-base font-normal text-red-500 hover:underline'>
            <Link to={'/forgot-password'} className='hover:text-red-500'>
              {t('login.forgotPassword')}
            </Link>
          </button>
          <CustomBtn
            title={t('login.loginButton')}
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
