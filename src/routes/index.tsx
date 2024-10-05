import { createHashRouter } from 'react-router-dom'

import { Login } from '@/pages/auth'

import { DefaultLayout, AuthLayout } from '@/layouts'

import { Account, CreateAccount, Generator, Home, Notification } from '@/pages/client'

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
        path: '/alert',
        element: <Notification />
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
  }
])
