import { useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { Button, Form, Select, Typography, message } from 'antd'

import { workspaceApi } from '@/apis'

import { accountService } from '@/services'

import { IAccountInputData, IWorkspaceInputData } from '@/interfaces'

import { CustomBtn, CustomInput } from '@/components'

import { BsPersonWorkspace, IoIosArrowBack } from '@/utils/common'

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
      <Form
        className='bg-white mt-3 p-3 border border-gray-200 text-gray-600'
        onFinish={handleSubmit(handleUpdateWorkspace)}
      >
        <CustomInput
          name='name'
          size='large'
          label='Workspace'
          control={control}
          errors={errors}
          placeholder='Enter workspace name'
          prefixIcon={<BsPersonWorkspace />}
        />
        <div className='flex flex-col mt-14 mb-2 text-left'>
          <label className='text-lg font-medium text-slate-800'>Choose accounts</label>
          <Controller
            name='accounts'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select accounts'
                className='text-lg '
                options={accountOptions}
                onChange={(value) => field.onChange(value)}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            )}
          />
          {errors.accounts && <Text type='danger'>{errors.accounts.message}</Text>}
        </div>
        <CustomBtn title='Update' type='primary' htmlType='submit' disabled={isPending} loading={isPending} />
      </Form>
    </section>
  )
}
