const actions = {
  openPopup: (tabs, sendResponse) => {
    chrome.action.openPopup()
    sendResponse({ status: 'success' })
  },
  openForm: (tabs, sendResponse) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'showFormCreateAccountIframe' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  closeForm: (tabs, sendResponse) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'closeFormCreateAccountIframe' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  showMoreOptions: (tabs, sendResponse) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'showMoreOptions' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  showModalGeneratePassword: (tabs, sendResponse) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'showModalGeneratePassword' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  noShowMoreOptions: (tabs, sendResponse) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'noShowMoreOptions' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  hiddenModalOptions: (tabs, sendResponse) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'hiddenModalOptions' }, () => {
      sendResponse({ status: 'success' })
    })
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const actionHandler = actions[request.action] || actions.hiddenModalOptions
    actionHandler(tabs, sendResponse)
  })

  return true
})
