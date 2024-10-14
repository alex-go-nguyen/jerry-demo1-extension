import { useEffect, useState } from 'react'

import { Checkbox, Layout, message, Slider, Tooltip } from 'antd'

import generator from 'generate-password-ts'

import { useCopyToClipboard } from '@/hooks'

import { FaCopy, LuRefreshCw } from '@/utils/common'
import { passwordSettingOptions } from '@/utils/constant'

const { Header } = Layout

type PasswordSettingKeys = 'length' | 'numbers' | 'symbols' | 'lowercase' | 'uppercase'
type PasswordSettings = Record<PasswordSettingKeys, number | boolean>

const passwordTemp = generator.generate({
  length: 50,
  numbers: true,
  symbols: true,
  lowercase: true,
  uppercase: true
})

export function Generator({ isShowHeader = true }) {
  const [, copy] = useCopyToClipboard()
  const [password, setPassword] = useState<string>(passwordTemp)

  const [disablePasswordSetting, setDisablePasswordSetting] = useState<string>('')

  const [passwordSettings, setPasswordSettings] = useState<PasswordSettings>({
    length: 50,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true
  })

  const handleCopyPasswordToClipboard = () => {
    copy(password)
      .then(() => {
        message.success('Copied password')
      })
      .catch((error) => {
        message.success('Copy password failed' + error)
      })
  }
  const handleGeneratePassword = () => {
    const { length, numbers, symbols, lowercase, uppercase } = passwordSettings
    const newPassword = generator.generate({
      length: length as number,
      numbers: !!numbers,
      symbols: !!symbols,
      lowercase: !!lowercase,
      uppercase: !!uppercase
    })

    setPassword(newPassword)
  }

  const handleChangePasswordSetting = (key: keyof PasswordSettings, checked: boolean) => {
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
    <div>
      {isShowHeader && (
        <Header className='text-left capitalize text-white font-semibold text-xl leading-[64px] bg-primary-800 px-3'>
          Password Generator
        </Header>
      )}

      <div className='mt-5 mx-4'>
        <div className='flex justify-between items-center border-2 border-slate-200 px-3 py-2'>
          <p className='text-slate-800 text-lg text-left truncate'>{password}</p>
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
            <p className='text-slate-800 text-xl text-left'>Password length</p>
            <p className='text-slate-800 text-lg text-right'>{passwordSettings.length}</p>
          </div>
          <Slider
            min={8}
            max={100}
            defaultValue={passwordSettings.length as number}
            onChange={(value) => setPasswordSettings({ ...passwordSettings, length: value })}
          />
        </div>

        <div className='flex flex-col mt-5'>
          <p className='text-slate-800 0 text-xl text-left mb-2'>Password settings</p>
          {passwordSettingOptions.map(({ key, text }) => (
            <Checkbox
              key={key}
              disabled={disablePasswordSetting === key}
              className='text-lg text-slate-700 mb-2'
              checked={!!passwordSettings[key as keyof PasswordSettings]}
              onChange={(e) => handleChangePasswordSetting(key as keyof PasswordSettings, e.target.checked)}
            >
              {text}
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  )
}
