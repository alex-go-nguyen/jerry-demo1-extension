import { NavLink } from 'react-router-dom'

import { Layout } from 'antd'

import { bottomTabList } from '@/utils/constant'
const { Footer } = Layout

export function BottomTab() {
  return (
    <Footer className='flex justify-between items-center text-white bg-[#4096ff] p-0'>
      {bottomTabList.map((bottomTabItem) => (
        <div className='flex-1' key={bottomTabItem.title}>
          <NavLink
            className={({ isActive }) =>
              `py-3 flex flex-col items-center justify-center ${isActive ? 'bg-primary-800' : ''}`
            }
            to={bottomTabItem.to}
          >
            <div className='text-lg font-semibold'>{bottomTabItem.icon}</div>
            <span className='font-medium'>{bottomTabItem.title}</span>
          </NavLink>
        </div>
      ))}
    </Footer>
  )
}
