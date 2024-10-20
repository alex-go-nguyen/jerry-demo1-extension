import React from 'react'

import { useNavigate } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'

import * as Yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Button, Dropdown, MenuProps, Modal, Select, Form, message } from 'antd'

import { useBoolean } from '@/hooks'

import { workspaceSharingApi } from '@/apis'

import { IWorkspaceData, IWorkspaceShareData } from '@/interfaces'

import { GrEdit, MdFolder, TbTrash, TfiMoreAlt, PiShareFat } from '@/utils/common'

type WorkspaceItemProps = {
  workspace: IWorkspaceData
  showAction: boolean
  setAccessWorkspace: React.Dispatch<React.SetStateAction<IWorkspaceData | undefined>>
  setDeleteWorkspaceId: React.Dispatch<React.SetStateAction<string>>
  setOpen: () => void
}

const schema = Yup.object().shape({
  workspaceId: Yup.string(),
  emails: Yup.array().of(Yup.string().email('Invalid email format')).min(1, 'Please enter at least one email to share')
})

export const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  showAction,
  setAccessWorkspace,
  setDeleteWorkspaceId,
  setOpen
}) => {
  const navigate = useNavigate()
  const { value: openModalShare, toggle: setOpenModalShare } = useBoolean(false)
  const { value: confirmLoading, toggle: setConfirmLoading } = useBoolean(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      emails: []
    }
  })

  const { mutate } = useMutation({
    mutationFn: workspaceSharingApi.create,
    onSuccess: () => {
      setOpenModalShare()
      message.success('Save account successful!')
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const onSubmit = (data: IWorkspaceShareData) => {
    setConfirmLoading()
    setTimeout(() => {
      setConfirmLoading()
    }, 2000)
    mutate(data)
  }
  const handleCancel = () => {
    setOpenModalShare()
  }

  const onActionWorkspaceClick = (key: string, workspace: IWorkspaceData) => {
    if (key === 'edit') {
      navigate('/edit-workspace', {
        state: { workspace }
      })
    } else if (key === 'delete') {
      setOpen()
      setDeleteWorkspaceId(workspace.id)
    } else if (key === 'share') {
      setOpenModalShare()
      setValue('workspaceId', workspace.id)
    }
  }

  const createActionWorkspace = (workspace: IWorkspaceData): MenuProps['items'] => [
    {
      key: 'share',
      label: (
        <span className='flex items-center text-slate-700 text-lg font-normal'>
          <PiShareFat className='mr-2' />
          Share
        </span>
      ),
      onClick: () => onActionWorkspaceClick('share', workspace)
    },
    {
      key: 'edit',
      label: (
        <span className='flex items-center text-slate-700 text-lg font-normal'>
          <GrEdit className='mr-2' />
          Edit
        </span>
      ),
      onClick: () => onActionWorkspaceClick('edit', workspace)
    },
    {
      key: 'delete',
      label: (
        <span className='flex items-center text-red-500 text-lg font-normal'>
          <TbTrash className='mr-2' />
          Delete
        </span>
      ),
      onClick: () => onActionWorkspaceClick('delete', workspace)
    }
  ]

  return (
    <li
      key={workspace.id}
      className='flex justify-between items-center p-2 hover:cursor-pointer hover:bg-slate-100 group'
    >
      <Modal
        title='Share workspace'
        open={openModalShare}
        onOk={handleSubmit(onSubmit)}
        okText='Share'
        cancelText='Close'
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form.Item
          label='Emails'
          validateStatus={errors.emails ? 'error' : ''}
          help={errors.emails && errors?.emails[0]?.message}
        >
          <Controller
            name='emails'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode='tags'
                className='w-full'
                placeholder='Type email and press Enter'
                tokenSeparators={[',', ' ']}
              />
            )}
          />
        </Form.Item>
      </Modal>

      <div className='flex items-center flex-1' onClick={() => setAccessWorkspace(workspace)}>
        <span className='text-3xl mr-1'>
          <MdFolder color='#ffd100e8' />
        </span>
        <span className='text-slate-700 text-lg font-medium group-hover:text-primary-500 group-hover:underline'>
          {workspace.name} ({workspace?.accounts?.length})
        </span>
      </div>
      {showAction && (
        <Dropdown menu={{ items: createActionWorkspace(workspace) }} placement='bottomRight' arrow>
          <Button className='bg-none outline-none border-none cursor-pointer'>
            <TfiMoreAlt className='text-primary-500 text-lg' />
          </Button>
        </Dropdown>
      )}
    </li>
  )
}
