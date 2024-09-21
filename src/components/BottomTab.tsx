import { NavLink } from 'react-router-dom'

import { Layout } from 'antd'

import { bottomTabList } from '@/utils/constant'
const { Footer } = Layout

export const BottomTab = () => {
  return (
    <Footer className='flex justify-between items-center text-white bg-[#4096ff] p-0'>
      {bottomTabList.map(({ Icon, ...bottomTabItem }) => (
        <div className='flex-1' key={bottomTabItem.title}>
          <NavLink className={({ isActive }) => `py-3 flex flex-col items-center justify-center ${isActive ? "bg-primary-800" : ""}`} to={bottomTabItem.to}>
            <Icon className='text-lg font-semibold' />
            <p className='font-medium'>{bottomTabItem.title}</p>
          </NavLink>
        </div>
      ))}
    </Footer>
  )
}
