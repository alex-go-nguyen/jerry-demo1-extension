chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'openPopup') {
    chrome.action.openPopup()
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openForm') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'showFormCreateAccountIframe' }, (response) => {
        sendResponse({ status: 'success' })
      })
    })
    return true
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'closeForm') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'closeFormCreateAccountIframe' }, (response) => {
        sendResponse({ status: 'success' })
      })
    })
    return true
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (request.action === 'showMoreOptions') {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'showMoreOptions' }, (response) => {
        sendResponse({ status: 'success' })
      })
    } else if (request.action === 'showModalGeneratePassword') {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'showModalGeneratePassword' }, (response) => {
        sendResponse({ status: 'success' })
      })
    } else if (request.action === 'noShowMoreOptions') {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'noShowMoreOptions' }, (response) => {
        sendResponse({ status: 'success' })
      })
    } else {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'hiddenModalOptions' }, (response) => {
        sendResponse({ status: 'success' })
      })
    }
  })
  return true
})
