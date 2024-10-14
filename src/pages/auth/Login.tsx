import { Link, useNavigate } from 'react-router-dom'

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

const schema = yup.object().shape({
  email: yup.string().email('Please input a valid Email!').required('Please input your email!'),
  password: yup.string().min(8, 'Password needs to be at least 8 characters.').required('Please input your password!')
})

export function Login() {
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
      message.success('Login successful!')
      navigate('/')
    },
    onError: (e) => {
      message.error('Login failed!' + e.message)
    }
  })

  const handleLogin = (data: ILoginInputData) => {
    mutate(data)
  }

  return (
    <section className='flex justify-center bg-white'>
      <div className='mb-auto bg-white round-md p-8 xl:w-[30%] lg:w-auto lg:mt-5 shadow-xl border border-gray-100 w-full'>
        <h1 className='text-3xl font-semibold mb-4'>Sign in</h1>
        <span className='text-lg'>If you don't have an account.</span> <br />
        <span className='text-lg inline-block mr-2'>You can</span>
        <a
          href={`${environmentConfig.clientUrl}/register`}
          target='_blank'
          className='text-lg text-blue-500 font-semibold hover:underline'
        >
          Register here!
        </a>
        <Form className='mt-6' onFinish={handleSubmit(handleLogin)} layout='vertical'>
          {authFields.map((field) => {
            if (field.name === 'email' || field.name === 'password')
              return (
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
              )
          })}
          <button className='w-full text-right text-base font-normal text-red-500 hover:underline'>
            <Link to={'/forgot-password'} className='hover:text-red-500'>
              Forgot password?
            </Link>
          </button>
          <CustomBtn title='Login' type='primary' htmlType='submit' disabled={isPending} loading={isPending} />
        </Form>
      </div>
    </section>
  )
}
