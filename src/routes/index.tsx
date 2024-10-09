import { createHashRouter } from 'react-router-dom'

import { Login } from '@/pages'

import { DefaultLayout, AuthLayout } from '@/layouts'

import {
  Account,
  CreateAccount,
  CreateWorkspace,
  EditAccount,
  EditWorkspace,
  Generator,
  Home,
  Workspace
} from '@/pages'

import { IframeModal } from '@/components'

export const router = createHashRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/generator',
        element: <Generator />
      },
      {
        path: '/workspace',
        element: <Workspace />
      },
      {
        path: '/create-workspace',
        element: <CreateWorkspace />
      },
      {
        path: '/edit-workspace',
        element: <EditWorkspace />
      },
      {
        path: '/account',
        element: <Account />
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
  {
    path: '/webclient-infield',
    element: <IframeModal />
  },
  {
    path: '/create-account',
    element: <CreateAccount />
  },
  {
    path: '/edit-account/:accountId',
    element: <EditAccount />
  }
])
