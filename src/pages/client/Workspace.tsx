import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, message, Modal } from 'antd'
import Search from 'antd/es/input/Search'

import { useBoolean } from '@/hooks'

import { workspaceApi } from '@/apis'

import { AccountItem, WorkspaceItem } from '@/components'

import { IAccountInputData, ICurrentUser, IWorkspaceData } from '@/interfaces'

import { BsPersonWorkspace, MdAdd, getCurrentUser } from '@/utils/common'
export function Workspace() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { data: listWorkspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      return await workspaceApi.getAll()
    }
  })

  const { data: currentUser } = useQuery<ICurrentUser>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return await getCurrentUser()
    }
  })
  const [accessWorkspace, setAccessWorkspace] = useState<IWorkspaceData>()

  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string>('')

  const { value: openWarningDeleteWorkspace, toggle: setOpenWarningDeleteWorkspace } = useBoolean(false)

  const onSearch = (data: string) => {
    console.log(data)
  }

  const onChangeText = (data: string) => {
    console.log(data)
  }

  const openForm = () => {
    navigate('/create-workspace')
  }

  const { mutate, isPending } = useMutation({
    mutationFn: workspaceApi.softDelete,
    onSuccess: () => {
      message.success('Delete workspace successful!')
      setOpenWarningDeleteWorkspace()
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const handleDelete = () => {
    if (deleteWorkspaceId) mutate(deleteWorkspaceId)
  }

  const handleCancel = () => {
    setDeleteWorkspaceId('')
    setOpenWarningDeleteWorkspace()
  }
  return (
    <section>
      <Modal
        open={openWarningDeleteWorkspace}
        title='Warning'
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button danger type='primary' onClick={handleDelete} loading={isPending}>
              Delete
            </Button>
          </>
        )}
      >
        <span>This workspace will be permanently removed from your vault.</span>
      </Modal>
      <div className='flex items-center border border-gray-300'>
        <Search
          className='p-2'
          placeholder='input search text'
          onSearch={onSearch}
          onChange={(e) => onChangeText(e.target.value)}
          enterButton
        />
        <Button type='primary' className='px-2 gap-1' onClick={openForm}>
          <span>Add</span>
          <MdAdd className='text-xl' />
        </Button>
      </div>
      <h2 className='text-center text-primary-800 text-2xl ml-2'>Your workspaces</h2>
      <div>
        {listWorkspaces?.length === 0 && (
          <div>
            <span className='text-gray-600 text-lg text-left'>You don't have any workspaces!</span>
          </div>
        )}
        {listWorkspaces?.length > 0 && !accessWorkspace && (
          <ul className='mt-2'>
            {listWorkspaces?.map((workspace: IWorkspaceData) => (
              <WorkspaceItem
                key={workspace.id}
                workspace={workspace}
                showAction={currentUser?.id === workspace.owner.id}
                setAccessWorkspace={setAccessWorkspace}
                setDeleteWorkspaceId={setDeleteWorkspaceId}
                setOpen={setOpenWarningDeleteWorkspace}
              />
            ))}
          </ul>
        )}

        {accessWorkspace && (
          <div>
            <div className='flex text-gray-600 items-center p-4 border-b border-b-gray-300'>
              <span className='text-xl mr-1 cursor-pointer' onClick={() => setAccessWorkspace(undefined)}>
                <BsPersonWorkspace color='#4096ff' />
              </span>
              <span className='text-gray-600 text-sm'> / {accessWorkspace.name}</span>
            </div>
            <ul>
              {accessWorkspace?.accounts?.map((account: IAccountInputData) => (
                <AccountItem key={account.id} account={account} showAction={false} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
