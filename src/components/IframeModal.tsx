import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { useBoolean } from '@/hooks'

import { Generator } from '@/pages'

import { accountService } from '@/services'

import { IAccountInputData } from '@/interfaces'

import { listMoreOptions } from '@/utils/constant'
import { AiFillLock, HiPencilSquare, IoIosArrowBack, IoIosAddCircle, decryptPassword } from '@/utils/common'

import { CustomInput } from './CustomInput'

export function IframeModal() {
  const { t } = useTranslation()

  const { data: listAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return await accountService.getListAccounts()
    }
  })

  const { value: showMoreOptions, toggle: toggleMoreOptions } = useBoolean(false)
  const { value: showModalGeneratePassword, setFalse, toggle: toggleModalGeneratePassword } = useBoolean(false)

  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [limitAccount, setLimitAccount] = useState<number>(3)
  const [listAccountOfDomain, setListAccountOfDomain] = useState<IAccountInputData[]>([])
  const [listSuggestAccounts, setListSuggestAccounts] = useState<IAccountInputData[]>([])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url?.split('/')[2]
      if (currentUrl) {
        setCurrentUrl(currentUrl)
      }
    })
  }, [])

  useEffect(() => {
    const listSuggestAccounts = listAccounts?.filter((account: IAccountInputData) =>
      account.domain.includes(currentUrl)
    )
    if (listSuggestAccounts?.length < 4) {
      chrome.runtime.sendMessage({
        action: 'updateHeight',
        height: `${(listSuggestAccounts?.length || 1) * 68 + 66}px`
      })
    } else {
      chrome.runtime.sendMessage({
        action: 'updateHeight',
        height: `${(limitAccount === listSuggestAccounts?.length ? 2.2 : 3) * 68 + 66 + 44 + 61}px`
      })
    }
    setListSuggestAccounts(listSuggestAccounts)
    setListAccountOfDomain(listSuggestAccounts)
  }, [currentUrl, limitAccount, listAccounts])

  const handleToggleOptions = () => {
    if (showModalGeneratePassword) {
      setFalse()
      chrome.runtime.sendMessage({ action: 'updateHeight', height: '193px' })
    } else {
      if (!showMoreOptions) {
        chrome.runtime.sendMessage({ action: 'updateHeight', height: '193px' })
      } else {
        if (listSuggestAccounts?.length < 4) {
          chrome.runtime.sendMessage({
            action: 'updateHeight',
            height: `${(listSuggestAccounts?.length || 1) * 68 + 66}px`
          })
        } else {
          chrome.runtime.sendMessage({
            action: 'updateHeight',
            height: `${(limitAccount === listSuggestAccounts?.length ? 2.2 : 3) * 68 + 66 + 44 + 61}px`
          })
        }
      }
      toggleMoreOptions()
    }
  }

  const handleToggleGeneratePassword = () => {
    toggleModalGeneratePassword()
    chrome.runtime.sendMessage({ action: 'updateHeight', height: '400px' })
  }

  const handleToggleShowFormCreateAccount = () => {
    chrome.runtime.sendMessage({ action: 'openForm' })
  }
  const handleFillAccountToInputField = (account: IAccountInputData) => () => {
    chrome.runtime.sendMessage({
      action: 'fillForm',
      username: account.username,
      password: decryptPassword(account.password)
    })
  }

  const handleLoadMore = () => {
    chrome.runtime.sendMessage({ action: 'updateHeight', height: '326px' })
    setLimitAccount(listSuggestAccounts.length)
  }
  const handleSearchAccount = (inputValue: string) => {
    const inputValueTrimmed = inputValue.trim()
    if (inputValueTrimmed) {
      const newSuggestAccounts = listSuggestAccounts.filter(
        (account) => account.domain.includes(inputValueTrimmed) || account.username.includes(inputValueTrimmed)
      )
      setListSuggestAccounts(newSuggestAccounts)
    } else {
      setListSuggestAccounts(listAccountOfDomain)
    }
  }
  const handleOpenTabEditAccount = (account: IAccountInputData) => () => {
    chrome.tabs.create({
      url: `index.html#/edit-account/${account.id}`
    })
  }
  return (
    <section className='w-full'>
      {showMoreOptions ? (
        <>
          <div
            onClick={handleToggleOptions}
            className='flex items-center text-blue-500  text-xl font-bold p-4 border-b border-b-gray-300 transition hover:bg-blue-200 hover:cursor-pointer'
          >
            <IoIosArrowBack className='text-2xl' />
            <span className='ml-2'>{t('iframeModal.back')}</span>
          </div>
          <div>
            {showModalGeneratePassword ? (
              <Generator isShowHeader={false} isShowCopy={false} />
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
                      <span className='text-lg ml-2'>{t(`iframeModal.${option.key}`)}</span>
                    </div>
                    <span className='text-xl'>{option.iconRight}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      ) : (
        <div className='flex flex-col'>
          {listAccountOfDomain?.length > 3 && (
            <CustomInput
              name='searchValue'
              size='large'
              placeholder='Search account'
              className='w-full text-lg font-medium m-0 hover:border-primary-800'
              onChange={(e: { target: { value: string } }) => handleSearchAccount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') return false
              }}
            />
          )}
          {listSuggestAccounts?.length > 0 && (
            <ul
              className={`max-h-[215px] overflow-x-hidden ${limitAccount > 3 && listSuggestAccounts?.length > 3 && 'overflow-y-scroll'}`}
            >
              {listSuggestAccounts.slice(0, limitAccount).map((account) => (
                <li
                  id='header-modal'
                  className='flex justify-between items-center border-t border-t-gray-300 transition hover:bg-blue-200 hover:cursor-pointer group'
                >
                  <div
                    className='flex flex-1 items-center p-2 max-w-[100px]'
                    onClick={handleFillAccountToInputField(account)}
                  >
                    <span className='mr-3 cursor-pointer p-1 rounded-sm'>
                      <AiFillLock className='text-primary-800 text-3xl align-middle' />
                    </span>
                    <div className='relative text-left max-w-[200px]'>
                      <span className='transition-all duration-500 text-base text-slate-600 text-left opacity-100 group-hover:opacity-0 group-hover:transform group-hover:translate-y-2'>
                        {account.domain}
                      </span>

                      <span className='absolute top-0 left-0 transition-all duration-500 text-sm font-bold opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-primary-500'>
                        {t('iframeModal.fill')}
                      </span>
                      <div className='text-left text-lg font-medium text-slate-700 overflow-hidden text-ellipsis'>
                        {account.username}
                      </div>
                    </div>
                  </div>
                  <div
                    className='p-2 hover:bg-blue-200 transition group-hover:bg-blue-300'
                    onClick={handleOpenTabEditAccount(account)}
                  >
                    <HiPencilSquare className='text-primary-800 text-2xl cursor-pointer' />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {limitAccount < listSuggestAccounts?.length && (
            <button
              className='w-full text-lg text-left p-4 cursor-pointer transition hover:bg-blue-200 border-t border-gray-300'
              onClick={handleLoadMore}
            >
              {t('iframeModal.loadMore')}
            </button>
          )}

          {listAccounts?.filter((account: IAccountInputData) => account.domain.includes(currentUrl))?.length === 0 && (
            <li
              id='header-modal'
              className='flex justify-between items-center border-b border-b-gray-300 transition hover:bg-blue-200 hover:cursor-pointer group'
              onClick={handleToggleShowFormCreateAccount}
            >
              <div className='flex flex-1 items-center p-2'>
                <span className='mr-3 cursor-pointer p-1 rounded-sm'>
                  <AiFillLock className='text-primary-800 text-3xl align-middle' />
                </span>
                <div className='relative text-left'>
                  <span className='transition-all duration-500 text-base text-slate-600 text-left opacity-100 group-hover:opacity-0 group-hover:transform group-hover:translate-y-2'>
                    {currentUrl}
                  </span>

                  <span className='absolute top-0 left-0 transition-all duration-500 text-sm font-bold opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-primary-500'>
                    {t('iframeModal.add')}
                  </span>
                  <div className='text-left text-lg font-medium text-slate-700'>{t('iframeModal.startTyping')}</div>
                </div>
              </div>
              <div className='mr-2 p-2 hover:bg-blue-200 transition'>
                <IoIosAddCircle className='text-primary-800 text-2xl cursor-pointer' />
              </div>
            </li>
          )}

          <button
            className='w-full text-lg text-left p-4 cursor-pointer transition hover:bg-blue-200 border-t border-gray-300'
            onClick={handleToggleOptions}
          >
            {t('iframeModal.moreOptions')}
          </button>
        </div>
      )}
    </section>
  )
}
