import { useEffect, useState } from 'react'

import { Checkbox, Layout, Slider, Tooltip } from 'antd'

import generator from 'generate-password-ts'

import { FaCopy, LuRefreshCw } from '@/utils'

import { passwordSettingOptions } from '@/utils/constant'

const { Header } = Layout

const passwordTemp = generator.generate({
  length: 50,
  numbers: true,
  symbols: true,
  lowercase: true,
  uppercase: true
})

export function Generator({ isShowHeader = true }) {
  const [password, setPassword] = useState<string>(passwordTemp)

  const [disablePasswordSetting, setDisablePasswordSetting] = useState<string>('')

  const [passwordSettings, setPasswordSettings] = useState({
    length: 50,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true
  })

  const handleCopyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password)
  }

  const handleGeneratePassword = () => {
    const newPassword = generator.generate(passwordSettings)
    setPassword(newPassword)
  }

  const handleChangePasswordSetting = (key: string, checked: boolean) => {
    const { length, ...updatedSettings } = { ...passwordSettings, [key]: checked }

    const activeSettingsCount = Object.values(updatedSettings).filter(Boolean).length

    if (activeSettingsCount === 1) {
      setDisablePasswordSetting(
        Object.keys(updatedSettings).find((setting) => updatedSettings[setting as keyof typeof updatedSettings]) || ''
      )
    } else {
      setDisablePasswordSetting('')
    }

    setPasswordSettings({ length, ...updatedSettings })
  }

  useEffect(() => {
    handleGeneratePassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordSettings])

  return (
    <section>
      {isShowHeader && (
        <Header className='text-left capitalize text-white font-semibold text-xl leading-[64px] bg-[#4096ff] px-3'>
          Password Generator
        </Header>
      )}

      <div className='mt-5 mx-4'>
        <div className='flex justify-between items-center border-2 border-gray-200 px-3 py-2'>
          <p className='text-gray-800 text-lg text-left truncate'>{password}</p>
          <div className='flex'>
            <Tooltip title='copy' color='blue'>
              <FaCopy
                className='mr-3 text-primary-500 text-lg cursor-pointer'
                onClick={handleCopyPasswordToClipboard}
              />
            </Tooltip>
            <Tooltip title='refresh' color='blue'>
              <LuRefreshCw className='text-primary-500 text-lg cursor-pointer' onClick={handleGeneratePassword} />
            </Tooltip>
          </div>
        </div>

        <div className='mt-5'>
          <div className='flex justify-between'>
            <p className='text-gray-800 text-lg text-left'>Password length</p>
            <p className='text-gray-800 text-lg text-right'>{passwordSettings.length}</p>
          </div>
          <Slider
            min={8}
            max={100}
            defaultValue={passwordSettings.length}
            onChange={(value) => setPasswordSettings({ ...passwordSettings, length: value })}
          />
        </div>

        <div className='flex flex-col mt-5'>
          <p className='text-gray-800 text-lg text-left mb-2'>Password settings</p>
          {passwordSettingOptions.map(({ key, text }) => (
            <Checkbox
              key={key}
              disabled={disablePasswordSetting === key}
              className='text-lg text-gray-700 mb-2'
              checked={!!passwordSettings[key as keyof typeof passwordSettings]}
              onChange={(e) => handleChangePasswordSetting(key, e.target.checked)}
            >
              {text}
            </Checkbox>
          ))}
        </div>
      </div>
    </section>
  )
}
