import { Generator } from '@/pages/client'
import {
  AiFillLock,
  HiPencilSquare,
  IoIosArrowBack,
  BiSolidKey,
  IoIosArrowForward,
  FaVault,
  LuArrowUpRight,
  IoSettingsSharp
} from '@/utils'
import { useState } from 'react'

export function IframeModal() {
  const [isHovered, setIsHovered] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showModalGeneratePassword, setShowModalGeneratePassword] = useState(false)
  const handleToggleOptions = () => {
    if (showModalGeneratePassword) {
      setShowModalGeneratePassword(false)
    } else {
      setShowMoreOptions((prev) => !prev)
    }
  }

  const handleToggleGeneratePassword = () => {
    setShowModalGeneratePassword((prev) => !prev)
  }
  return (
    <section className='w-[280px]'>
      {showMoreOptions ? (
        <>
          <div
            onClick={handleToggleOptions}
            className='flex items-center text-blue-500  text-xl font-bold p-4 border-b border-b-gray-300 transition hover:bg-blue-200 hover:cursor-pointer'
          >
            <IoIosArrowBack className='text-2xl' />
            <p className='ml-2'>Back</p>
          </div>
          <div className=''>
            {showModalGeneratePassword ? (
              <Generator isShowHeader={false} />
            ) : (
              <>
                <div
                  className='flex justify-between items-center hover:bg-blue-200 transition cursor-pointer px-4 py-2'
                  onClick={handleToggleGeneratePassword}
                >
                  <div className='flex items-center text-gray-700'>
                    <BiSolidKey className='text-xl' />
                    <p className='ml-2'>Generate a password</p>
                  </div>
                  <IoIosArrowForward className='text-xl' />
                </div>

                <div className='flex justify-between items-center hover:bg-blue-200 transition cursor-pointer px-4 py-2'>
                  <div className='flex items-center text-gray-700'>
                    <FaVault className='text-xl' />
                    <p className='ml-2'>Open my vault</p>
                  </div>
                  <LuArrowUpRight className='text-xl' />
                </div>

                <div className='flex justify-between items-center hover:bg-blue-200 transition cursor-pointer px-4 py-2'>
                  <div className='flex items-center text-gray-700'>
                    <IoSettingsSharp className='text-xl' />
                    <p className='ml-2'>Open my vault</p>
                  </div>
                  <LuArrowUpRight className='text-xl' />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className='flex justify-between items-center border-b border-b-gray-300 transition hover:bg-blue-200 hover:cursor-pointer'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className='flex items-center p-2'>
              <div className='mr-3 cursor-pointer p-1 rounded-sm'>
                <AiFillLock className='text-primary-800 text-3xl align-middle' />
              </div>
              <div className='relative'>
                <p
                  className={`transition-all duration-500 ${
                    isHovered ? 'opacity-0 transform translate-y-2' : 'opacity-100'
                  }`}
                >
                  21521864z
                </p>
                <p
                  className={`absolute top-0 left-0 transition-all duration-500 ${
                    isHovered
                      ? 'opacity-100 transform translate-y-0 text-primary-800 font-semibold'
                      : 'opacity-0 transform -translate-y-2'
                  }`}
                >
                  Fill
                </p>
                <p>21521864</p>
              </div>
            </div>
            <div className='mr-2 p-2 hover:bg-blue-200 transition'>
              <HiPencilSquare className='text-primary-800 text-2xl cursor-pointer' />
            </div>
          </div>
          <p className='p-4 cursor-pointer transition hover:bg-blue-200' onClick={handleToggleOptions}>
            More options...
          </p>
        </>
      )}
    </section>
  )
}
