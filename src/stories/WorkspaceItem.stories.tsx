import { MemoryRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Meta, StoryFn } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { WorkspaceItem } from '@/components'

import { IWorkspaceData } from '@/interfaces'

const meta: Meta = {
  title: 'Components/WorkspaceItem',
  component: WorkspaceItem,
  tags: ['autodocs'],
  argTypes: {
    setAccessWorkspace: { action: 'setAccessWorkspace' },
    setDeleteWorkspaceId: { action: 'setDeleteWorkspaceId' },
    setOpen: { action: 'setOpen' }
  }
}

export default meta

const queryClient = new QueryClient()

const mockWorkspace: IWorkspaceData = {
  id: '1',
  owner: {
    id: '1',
    name: 'Owner'
  },
  name: 'Demo Workspace',
  accounts: [
    { id: '1', username: 'Account 1', password: '12345678', domain: 'example.domain.com' },
    { id: '2', username: 'Account 2', password: '12345678', domain: 'example.domain.com' }
  ]
}

const Template: StoryFn<typeof WorkspaceItem> = (args) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <WorkspaceItem {...args} />
    </MemoryRouter>
  </QueryClientProvider>
)

export const WithActions = Template.bind({})
WithActions.args = {
  workspace: mockWorkspace,
  showAction: true,
  setAccessWorkspace: action('setAccessWorkspace'),
  setDeleteWorkspaceId: action('setDeleteWorkspaceId'),
  setOpen: action('setOpen')
}

export const WithoutActions = Template.bind({})
WithoutActions.args = {
  workspace: mockWorkspace,
  showAction: false,
  setAccessWorkspace: action('setAccessWorkspace'),
  setDeleteWorkspaceId: action('setDeleteWorkspaceId'),
  setOpen: action('setOpen')
}
