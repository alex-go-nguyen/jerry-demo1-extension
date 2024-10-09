import { useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { Button, Input, Select, Spin, Typography, message } from 'antd'

import { IAccountInputData, IWorkspaceInputData } from '@/interfaces'

import { BsPersonWorkspace, IoIosArrowBack } from '@/utils/common'

import { workspaceApi } from '@/apis'

import { accountService } from '@/services'

const { Text } = Typography

const editWorkspaceSchema = yup.object().shape({
  name: yup.string().required('Please input your workspace!'),
  accounts: yup.array().min(1, 'Please select at least one account!').required('Please select accounts!')
})

type accountOption = {
  label: string
  value: string
}

export function EditWorkspace() {
  const queryClient = useQueryClient()

  const location = useLocation()

  const { workspace } = location.state || null

  const navigate = useNavigate()
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return await accountService.getListAccounts()
    }
  })

  const handleBack = () => {
    navigate('/workspace')
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IWorkspaceInputData>({
    resolver: yupResolver(editWorkspaceSchema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: workspaceApi.update,
    onSuccess: () => {
      handleBack()
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      message.success('Update workspace successful!')
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const handleUpdateWorkspace = (data: IWorkspaceInputData) => {
    mutate({ ...workspace, ...data })
  }

  const accountOptions: accountOption[] = accounts.map((account: IAccountInputData) => ({
    label: `${account.domain} (${account.username})`,
    value: account.id
  }))

  useEffect(() => {
    setValue('name', workspace?.name)
    setValue(
      'accounts',
      workspace?.accounts?.map((account: { id: string }) => account.id)
    )
  }, [setValue, workspace])

  return (
    <section className='w-full p-2'>
      <div className='flex items-center'>
        <Button className='p-3 mr-5 gap-0 text-primary-500' onClick={handleBack}>
          <IoIosArrowBack className='text-xl' />
        </Button>
        <h2 className='text-xl text-primary-500 font-semibold'>Edit your workspace</h2>
      </div>
      <form
        className='bg-white mt-3 p-3 border border-gray-200 text-gray-600'
        onSubmit={handleSubmit(handleUpdateWorkspace)}
      >
        <div className='flex flex-col text-left'>
          <label className='text-left font-semibold' htmlFor=''>
            Workspace
          </label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size='large'
                placeholder='Enter workspace name'
                type='text'
                prefix={<BsPersonWorkspace />}
                className='border-0 border-b border-gray-400 hover:border-primary-800 focus:ring-0 focus:outline-none focus-within:shadow-none rounded-none px-0'
              />
            )}
          />

          {errors.name && <Text type='danger'>{errors.name.message}</Text>}
        </div>

        <div className='flex flex-col mt-3 text-left'>
          <label className='font-semibold' htmlFor=''>
            Choose accounts
          </label>
          <Controller
            name='accounts'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select accounts'
                options={accountOptions}
                onChange={(value) => field.onChange(value)}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            )}
          />
          {errors.accounts && <Text type='danger'>{errors.accounts.message}</Text>}
        </div>

        <Button
          type='primary'
          htmlType='submit'
          disabled={isPending}
          className='w-full h-12 mt-4 border-none font-bold rounded-md bg-primary-800 
         disabled:bg-primary-800 disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {isPending ? <Spin className='text-rose-600' /> : 'Update workspace'}
        </Button>
      </form>
    </section>
  )
}
