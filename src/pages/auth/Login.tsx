import { Link, useNavigate } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { Button, Input, Spin, Typography, message } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'

import { authApi } from '@/apis'

import { useChromeStorage } from '@/hooks'

import { localStorageKeys } from '@/utils/constant'

import { ILoginInputData } from '@/interfaces'

const { Text } = Typography

const schema = yup.object().shape({
  email: yup.string().email('Please input a valid Email!').required('Please input your Email!'),
  password: yup.string().min(8, 'Password needs to be at least 8 characters.').required('Please input your Password!')
})

export function Login() {
  const navigate = useNavigate()
  const { setValue: setAccessToken } = useChromeStorage<string>(localStorageKeys.accessToken)
  const { setValue: setRefreshToken } = useChromeStorage<string>(localStorageKeys.accessToken)
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
      message.error('Login failed. Please try again!' + e)
    }
  })

  const handleLogin = (data: ILoginInputData) => {
    mutate(data)
  }

  return (
    <section className='flex justify-center bg-white'>
      <div className='mb-auto bg-white round-md p-8 xl:w-[30%] lg:w-auto lg:mt-5 shadow-xl border border-gray-100'>
        <h1 className='text-3xl font-semibold mb-4'>Sign in</h1>
        <p>If you don't have an account.</p>
        <span className='inline-block mr-2'>You can</span>
        <Link to='/auth/register' className='text-[#5067f7] font-semibold'>
          Register here!
        </Link>
        <form className='mt-6' onSubmit={handleSubmit(handleLogin)}>
          <div className=''>
            <label className='font-semibold' htmlFor=''>
              Email
            </label>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size='large'
                  placeholder='Enter your email address'
                  type='email'
                  prefix={<MailOutlined />}
                  className='border-0 border-b-2 border-gray-400 hover:border-primary-800 focus:ring-0 focus:outline-none focus-within:shadow-none rounded-none px-0'
                />
              )}
            />
            {errors.email && <Text type='danger'>{errors.email.message}</Text>}
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
          <p className='text-right text-red-500 hover:underline '>
            <Link to={'/auth/forgot-password'} className='hover:text-red-500'>
              Forgot password?
            </Link>
          </p>

          <Button
            type='primary'
            htmlType='submit'
            disabled={isPending}
            className='w-full h-12 mt-4 border-none font-bold rounded-md bg-primary-800 
         disabled:bg-primary-800 disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isPending ? <Spin className='text-rose-600' /> : 'Login'}
          </Button>
        </form>
      </div>
    </section>
  )
}
