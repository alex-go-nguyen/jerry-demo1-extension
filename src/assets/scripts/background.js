const actions = {
  openPopup: (tabs, sendResponse, request) => {
    chrome.action.openPopup()
    sendResponse({ status: 'success' })
  },
  openForm: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0]?.id, { action: 'showFormCreateAccountIframe' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  closeForm: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0]?.id, { action: 'closeFormCreateAccountIframe' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  updateHeight: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0]?.id, { action: 'updateHeight', height: request.height }, () => {
      sendResponse({ status: 'success' })
    })
  },
  fillForm: (tabs, sendResponse, request) => {
    const { username, password } = request
    chrome.tabs.sendMessage(tabs[0]?.id, { action: 'fillForm', username, password }, () => {
      sendResponse({ status: 'success' })
    })
  },
  fillPassword: (tabs, sendResponse, request) => {
    const { password } = request
    chrome.tabs.sendMessage(tabs[0]?.id, { action: 'fillPassword', password }, () => {
      sendResponse({ status: 'success' })
    })
  },
  getCurrentTabUrl: (tabs, sendResponse, request) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      sendResponse({ url: currentTab?.url })
    })
  }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const actionHandler = actions[request.action] || actions.hiddenModalOptions
    actionHandler(tabs, sendResponse, request)
  })

  return true
})
