import { useNavigate } from 'react-router-dom'

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

const createWorkspaceSchema = yup.object().shape({
  name: yup.string().required('Please input your workspace!'),
  accounts: yup.array().min(1, 'Please select at least one account!').required('Please select accounts!')
})

type accountOption = {
  label: string
  value: string
}

export function CreateWorkspace() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return await accountService.getListAccounts()
    }
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IWorkspaceInputData>({
    resolver: yupResolver(createWorkspaceSchema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: workspaceApi.create,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      message.success('Save account successful!')
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const handleSaveWorkspace = (data: IWorkspaceInputData) => {
    mutate(data)
  }

  const accountOptions: accountOption[] = accounts.map((account: IAccountInputData) => ({
    label: `${account.domain} (${account.username})`,
    value: account.id
  }))

  const handleBack = () => {
    navigate('/workspace')
  }
  return (
    <section className='w-full p-2'>
      <div className='flex items-center'>
        <Button className='p-3 mr-7 gap-0 text-primary-800 border border-primary-800' onClick={handleBack}>
          <IoIosArrowBack className='text-xl' />
        </Button>
        <h2 className='text-xl text-primary-800 font-semibold'>Create your workspace</h2>
      </div>
      <Form
        className='bg-white mt-3 p-3 border border-gray-200 text-gray-600'
        onFinish={handleSubmit(handleSaveWorkspace)}
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
        <div className='flex flex-col mt-3 mb-2 text-left'>
          <label className='text-lg font-normal text-slate-800'>Choose accounts</label>
          <Controller
            name='accounts'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode='multiple'
                placeholder='Select accounts'
                options={accountOptions}
                onChange={(value) => field.onChange(value)}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            )}
          />
          {errors.accounts && <Text type='danger'>{errors.accounts.message}</Text>}
        </div>
        <CustomBtn title='Create' type='primary' htmlType='submit' disabled={isPending} loading={isPending} />
      </Form>
    </section>
  )
}
