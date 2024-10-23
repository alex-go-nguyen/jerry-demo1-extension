import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, message, Modal } from 'antd'
import { useBoolean } from '@/hooks'
import { workspaceApi } from '@/apis'
import { IAccountInputData, ICurrentUser, IWorkspaceData } from '@/interfaces'
import { AccountItem, CustomBtn, CustomInput, WorkspaceItem } from '@/components'
import { BsPersonWorkspace, MdAdd, getCurrentUser } from '@/utils/common'
import { useTranslation } from 'react-i18next'

export function Workspace() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: listWorkspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => await workspaceApi.getAll()
  })

  const { data: currentUser } = useQuery<ICurrentUser>({
    queryKey: ['currentUser'],
    queryFn: async () => await getCurrentUser()
  })

  const [accessWorkspace, setAccessWorkspace] = useState<IWorkspaceData>()
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string>('')
  const [listSuggestWorkspaces, setListSuggestWorkspaces] = useState<IWorkspaceData[]>([])
  const { value: openWarningDeleteWorkspace, toggle: setOpenWarningDeleteWorkspace } = useBoolean(false)

  const handleOpenFormCreateWorkspace = () => {
    navigate('/create-workspace')
  }

  const { mutate, isPending } = useMutation({
    mutationFn: workspaceApi.softDelete,
    onSuccess: () => {
      message.success(t('workspace.deleteSuccess'))
      setOpenWarningDeleteWorkspace()
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: () => {
      message.error(t('workspace.deleteError'))
    }
  })

  useEffect(() => {
    setListSuggestWorkspaces(listWorkspaces)
  }, [listWorkspaces])

  const handleSearchWorkspace = (searchValue: string) => {
    const newSuggestWorkspaces = listWorkspaces.filter((workspace: IWorkspaceData) =>
      workspace.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    setListSuggestWorkspaces(newSuggestWorkspaces)
  }

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
        title={t('workspace.warning')}
        onCancel={handleCancel}
        cancelText={t('workspace.cancelButton')}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button danger type='primary' onClick={handleDelete} loading={isPending}>
              {t('workspace.deleteButton')}
            </Button>
          </>
        )}
      >
        <span>{t('workspace.deleteConfirmation')}</span>
      </Modal>
      <div className='flex items-center py-3 border border-gray-300'>
        <CustomInput
          name='searchValue'
          size='large'
          placeholder={t('workspace.searchPlaceholder')}
          className='text-lg font-medium mx-2 border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom'
          onChange={(e: { target: { value: string } }) => handleSearchWorkspace(e.target.value)}
        />
        <CustomBtn
          title={t('workspace.addButton')}
          type='primary'
          className='!mt-0 !w-[100px] !h-11 mr-2'
          children={<MdAdd className='text-2xl' />}
          onClick={handleOpenFormCreateWorkspace}
        />
      </div>
      <h2 className='text-center text-primary-800 text-2xl font-medium pt-3 py-2'>{t('workspace.yourWorkspaces')}</h2>
      <div>
        {listSuggestWorkspaces?.length === 0 && (
          <div>
            <span className='text-gray-600 text-lg text-left'>{t('workspace.noWorkspaces')}</span>
          </div>
        )}
        {listSuggestWorkspaces?.length > 0 && !accessWorkspace && (
          <ul className='mt-1'>
            {listSuggestWorkspaces?.map((workspace: IWorkspaceData) => (
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
            <div className='flex text-gray-600 items-center px-4 pb-4 border-b border-b-gray-300'>
              <span className='text-xl mr-1 cursor-pointer' onClick={() => setAccessWorkspace(undefined)}>
                <BsPersonWorkspace className='text-primary-800 text-2xl' />
              </span>
              <span className='text-slate-700 text-lg font-medium'> / {accessWorkspace.name}</span>
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
