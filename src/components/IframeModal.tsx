import { useEffect, useState } from 'react'

import { useBoolean } from '@/hooks'

import { Generator } from '@/pages/client'

import {
  AiFillLock,
  HiPencilSquare,
  IoIosArrowBack,
  BiSolidKey,
  IoIosArrowForward,
  FaVault,
  LuArrowUpRight,
  IoSettingsSharp,
  IoIosAddCircle
} from '@/utils/common'

export function IframeModal() {
  const { value: isHovered, toggle: setIsHovered } = useBoolean(false)
  const { value: showMoreOptions, toggle: setShowMoreOptions } = useBoolean(false)
  const { value: showModalGeneratePassword, setFalse, toggle: setShowModalGeneratePassword } = useBoolean(false)

  const [currentUrl, setCurrentUrl] = useState('')

  const [listAccounts] = useState([
    // {
    //   ac_id: '1',
    //   username: 'hihi',
    //   password: 'hihi'
    // }
  ])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url?.split('/')[2]
      if (currentUrl) {
        setCurrentUrl(currentUrl)
      }
      console.log(currentUrl)
    })
  }, [])
  
  const handleToggleOptions = () => {
    if (showModalGeneratePassword) {
      setFalse()
      chrome.runtime.sendMessage({ action: 'showMoreOptions' })
    } else {
      if(showMoreOptions){
        chrome.runtime.sendMessage({ action: 'noShowMoreOptions' })
      }
      else {
        chrome.runtime.sendMessage({ action: 'showMoreOptions' })

      }
      setShowMoreOptions()
    }
  }

  const handleToggleGeneratePassword = () => {
    setShowModalGeneratePassword()
    chrome.runtime.sendMessage({ action: 'showModalGeneratePassword' })
  }

  const handleToggleShowFormCreateAccountOrFillForm = () => {
    if (listAccounts.length > 0) {
      console.log('Fill')
    } else {
      chrome.runtime.sendMessage({ action: 'openForm' })
    }
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
          <div>
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
                    <span className='text-lg ml-2'>Generate a password</span>
                  </div>
                  <IoIosArrowForward className='text-xl' />
                </div>

                <div className='flex justify-between items-center hover:bg-blue-200 transition cursor-pointer px-4 py-2'>
                  <div className='flex items-center text-gray-700'>
                    <FaVault className='text-xl' />
                    <span className='text-lg ml-2'>Open my vault</span>
                  </div>
                  <LuArrowUpRight className='text-xl' />
                </div>

                <div className='flex justify-between items-center hover:bg-blue-200 transition cursor-pointer px-4 py-2'>
                  <div className='flex items-center text-gray-700'>
                    <IoSettingsSharp className='text-xl' />
                    <span className='text-lg ml-2'>Settings</span>
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
            id='header-modal'
            className='flex justify-between items-center border-b border-b-gray-300 transition hover:bg-blue-200 hover:cursor-pointer'
            onMouseEnter={() => setIsHovered()}
            onMouseLeave={() => setIsHovered()}
            onClick={handleToggleShowFormCreateAccountOrFillForm}
          >
            <div className='flex items-center p-2'>
              <div className='mr-3 cursor-pointer p-1 rounded-sm'>
                <AiFillLock className='text-primary-800 text-3xl align-middle' />
              </div>
              <div className='relative'>
                <div
                  className={`transition-all duration-500 ${
                    isHovered ? 'opacity-0 transform translate-y-2' : 'opacity-100'
                  }`}
                >
                  {currentUrl}
                </div>
                <div
                  className={`absolute top-0 left-0 transition-all duration-500 text-lg ${
                    isHovered
                      ? 'opacity-100 transform translate-y-0 text-primary-800 font-semibold'
                      : 'opacity-0 transform -translate-y-2'
                  }`}
                  id='status-can-add-account'
                >
                   {listAccounts.length > 0 ? 'Fill' : 'Add'}
                </div>
                <div className='text-lg'> {listAccounts.length > 0 ? listAccounts[0]['username'] : 'Start typing'}</div>

              </div>
            </div>
            <div className='mr-2 p-2 hover:bg-blue-200 transition'>
              {listAccounts.length > 0 ? (
                <HiPencilSquare className='text-primary-800 text-2xl cursor-pointer' />
              ) : (
                <IoIosAddCircle className='text-primary-800 text-2xl cursor-pointer' />
              )}
            </div>
          </div>
          <div className='text-lg p-4 cursor-pointer transition hover:bg-blue-200' onClick={handleToggleOptions}>
            More options...
          </div>
        </>
      )}
    </section>
  )
}
