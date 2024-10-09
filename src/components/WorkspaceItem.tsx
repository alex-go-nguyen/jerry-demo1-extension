import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button, Dropdown, MenuProps } from 'antd'

import { IWorkspaceData } from '@/interfaces'

import { GrEdit, MdFolder, TbTrash, TfiMoreAlt, PiShareFat } from '@/utils/common'

type WorkspaceItemProps = {
  workspace: IWorkspaceData
  showAction: boolean
  setAccessWorkspace: React.Dispatch<React.SetStateAction<IWorkspaceData | undefined>>
  setDeleteWorkspaceId: React.Dispatch<React.SetStateAction<string>>
  setOpen: () => void
}

export const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  showAction,
  setAccessWorkspace,
  setDeleteWorkspaceId,
  setOpen
}) => {
  const navigate = useNavigate()
  const onActionWorkspaceClick = (key: string, workspace: IWorkspaceData) => {
    if (key === 'edit') {
      console.log(workspace)
      navigate('/edit-workspace', {
        state: { workspace }
      })
    } else if (key === 'delete') {
      setOpen()
      setDeleteWorkspaceId(workspace.id)
    }
  }

  const createActionWorkspace = (workspace: IWorkspaceData): MenuProps['items'] => [
    {
      key: 'share',
      label: (
        <span className='flex items-center text-blue-500'>
          <PiShareFat className='mr-2' />
          Share
        </span>
      ),
      onClick: () => onActionWorkspaceClick('edit', workspace)
    },
    {
      key: 'edit',
      label: (
        <span className='flex items-center text-green-500'>
          <GrEdit className='mr-2' />
          Edit
        </span>
      ),
      onClick: () => onActionWorkspaceClick('edit', workspace)
    },
    {
      key: 'delete',
      label: (
        <span className='flex items-center text-red-500'>
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
      <div className='flex items-center flex-1' onClick={() => setAccessWorkspace(workspace)}>
        <span className='text-3xl mr-1'>
          <MdFolder color='#ffd100e8' />
        </span>
        <span className='text-gray-700 text-lg group-hover:text-primary-500 group-hover:underline'>
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
