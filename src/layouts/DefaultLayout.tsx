import { useEffect } from 'react'

import { Outlet, useNavigate } from 'react-router-dom'

import { Layout } from 'antd'

import { BottomTab } from '@/components'

import { localStorageKeys } from '@/utils/constant'

const { Content } = Layout

export const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const getDataLocal = async () => {
      try {
        const result = await chrome.storage.local.get(localStorageKeys.accessToken)
        if (!result[localStorageKeys.accessToken]) {
          navigate('/login')
        }
      } catch (error) {
        navigate('/login')
        chrome.storage.local.clear()
        console.error('Error getting data from chrome.storage:', error)
      }
    }
    getDataLocal()
  }, [navigate])

  return (
    <Layout className='w-[375px] h-[600px] max-w-full overflow-hidden border border-gray-800'>
      <Content className='text-center min-h-[120px] text-white bg-white overflow-y-auto'>
        <Outlet />
      </Content>
      <BottomTab />
    </Layout>
  )
}
