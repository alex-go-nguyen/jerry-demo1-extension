export const loadLanguageFromStorage = async () => {
  const response = await chrome.storage.sync.get('language')
  return response?.language || 'en'
}
