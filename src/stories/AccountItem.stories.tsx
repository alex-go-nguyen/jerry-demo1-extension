import { Meta, StoryFn } from '@storybook/react'

import { AccountItem } from '@/components'

import { IAccountInputData } from '@/interfaces'

const meta: Meta = {
  title: 'Components/AccountItem',
  component: AccountItem,
  tags: ['autodocs'],
  argTypes: {
    setOpen: { action: 'setOpen' },
    setDeleteAccountId: { action: 'setDeleteAccountId' }
  }
}

export default meta

const mockAccount: IAccountInputData = {
  id: '1',
  domain: 'example.com',
  username: 'user@example.com',
  password: 'encrypted_password'
}

const Template: StoryFn<typeof AccountItem> = (args) => <AccountItem {...args} />

export const WithActions = Template.bind({})
WithActions.args = {
  account: mockAccount,
  showAction: true
}

export const WithoutActions = Template.bind({})
WithoutActions.args = {
  account: mockAccount,
  showAction: false
}
