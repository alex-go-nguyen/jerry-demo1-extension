import { Outlet } from 'react-router-dom'

import { Layout } from 'antd'

const { Content } = Layout

export const AuthLayout = () => {
  return (
    <Layout className='w-[375px] lg:w-auto max-w-full overflow-hidden'>
      <Content className='min-h-[120px]'>
        <Outlet />
      </Content>
    </Layout>
  )
}
