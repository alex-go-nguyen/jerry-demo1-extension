const actions = {
  openPopup: (tabs, sendResponse, request) => {
    chrome.action.openPopup()
    sendResponse({ status: 'success' })
  },
  openForm: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'showFormCreateAccountIframe' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  closeForm: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'closeFormCreateAccountIframe' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  showMoreOptions: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'showMoreOptions' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  showModalGeneratePassword: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'showModalGeneratePassword' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  noShowMoreOptions: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'noShowMoreOptions' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  clickLoadMore: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'clickLoadMore' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  hideLoadMore: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'hideLoadMore' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  hiddenModalOptions: (tabs, sendResponse, request) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'hiddenModalOptions' }, () => {
      sendResponse({ status: 'success' })
    })
  },
  fillForm: (tabs, sendResponse, request) => {
    const { username, password } = request
    chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForm', username, password }, () => {
      sendResponse({ status: 'success' })
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
