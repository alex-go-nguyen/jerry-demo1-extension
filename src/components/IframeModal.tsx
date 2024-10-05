import { useEffect, useState } from 'react'

import { useBoolean } from '@/hooks'

import { Generator } from '@/pages/client'

import { AiFillLock, HiPencilSquare, IoIosArrowBack, IoIosAddCircle } from '@/utils/common'

import { listMoreOptions } from '@/utils/constant'

export function IframeModal() {
  const { value: isHovered, toggle: toggleHovered } = useBoolean(false)
  const { value: showMoreOptions, toggle: toggleMoreOptions } = useBoolean(false)
  const { value: showModalGeneratePassword, setFalse, toggle: toggleModalGeneratePassword } = useBoolean(false)

  const [currentUrl, setCurrentUrl] = useState('kkk')

  const [listAccounts] = useState([])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url?.split('/')[2]
      if (currentUrl) {
        setCurrentUrl(currentUrl)
      }
    })
  }, [])

  const handleToggleOptions = () => {
    if (showModalGeneratePassword) {
      setFalse()
      chrome.runtime.sendMessage({ action: 'showMoreOptions' })
    } else {
      if (showMoreOptions) {
        chrome.runtime.sendMessage({ action: 'noShowMoreOptions' })
      } else {
        chrome.runtime.sendMessage({ action: 'showMoreOptions' })
      }
      toggleMoreOptions()
    }
  }

  const handleToggleGeneratePassword = () => {
    toggleModalGeneratePassword()
    chrome.runtime.sendMessage({ action: 'showModalGeneratePassword' })
  }

  const handleToggleShowFormCreateAccountOrFillForm = () => {
    if (listAccounts.length === 0) {
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
                {listMoreOptions.map((option) => (
                  <div
                    key={option.key}
                    className='flex justify-between items-center hover:bg-blue-200 transition cursor-pointer px-4 py-2'
                    onClick={option.key === 'generate' ? handleToggleGeneratePassword : () => {}}
                  >
                    <div className='flex items-center text-gray-700'>
                      <span className='text-xl'>{option.iconLeft}</span>
                      <span className='text-lg ml-2'>{option.text}</span>
                    </div>
                    <span className='text-xl'>{option.iconRight}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            id='header-modal'
            className='flex justify-between items-center border-b border-b-gray-300 transition hover:bg-blue-200 hover:cursor-pointer'
            onMouseEnter={() => toggleHovered()}
            onMouseLeave={() => toggleHovered()}
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
