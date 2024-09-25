import { useState } from 'react'

export const useChromeStorage = <T>(key: string) => {
  const [storedValue, setStoredValue] = useState<T>()

  const setValue = async (value: T) => {
    try {
      await chrome.storage.local.set({ [key]: value })
      setStoredValue(value)
    } catch (error) {
      console.error('Error setting data to chrome.storage:', error)
    }
  }
  return { storedValue, setValue }
}
