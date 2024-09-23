window.addEventListener('load', function () {
  // Root chua
  const goPassRoot = this.document.createElement('div')
  goPassRoot.id = 'go-pass-root'
  goPassRoot.style = `
    position: absolute !important;
    top: 0px !important;
    left: 0px !important;
    height: 0px !important;
    width: 0px !important;
  `
  const goPassShadowRoot = goPassRoot.attachShadow({ mode: 'open' })
  this.document.body.append(goPassRoot)

  // Modal dung cho show duoi cac o input
  const modalDiv = this.document.createElement('div')
  modalDiv.id = 'go-pass-modal-container'
  modalDiv.style = `
    position: absolute; 
    display: none;
    width: 100vw;
    height: 13vh;
    z-index: 2147483647;
    border-radius: 4px;
    max-width: 280px;
    background: radial-gradient(circle at 146.297px 0%, rgb(251, 235, 235) 1.47%, rgb(249, 250, 251) 20.77%);
    border: 1px solid rgb(213, 217, 222);
    box-shadow: rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.04) 0px 4px 8px;
  `
  const modalIframe = document.createElement('iframe')
  modalIframe.id = 'go-pass-modal-option'
  modalIframe.src = chrome.runtime.getURL('index.html#/webclient-infield')
  modalIframe.style = `
    border: none;
    height: 100%;
    width: 100%;
  `
  modalIframe.allow = 'clipboard-write'
  modalDiv.appendChild(modalIframe)
  goPassShadowRoot.appendChild(modalDiv)

  // Cai form de add u/p
  const formSaveAccount = this.document.createElement('iframe')
  formSaveAccount.id = 'go-pass-form-save-account'
  formSaveAccount.src = chrome.runtime.getURL('index.html#/create-account')
  formSaveAccount.style = `
    position: fixed;
    display: none;
    top: 0px;
    right: 0px;
    z-index: 2147483647;
    border: none;
    height: 100vh;
    width: 100vw;
    max-height: 500px;
    max-width: 430px;
  `
  goPassShadowRoot.appendChild(formSaveAccount)

  // Ham chinh vi tri icon

  const positionIcon = (icon, passwordField) => {
    const rect = passwordField.getBoundingClientRect()
    const computedStyles = window.getComputedStyle(passwordField)

    const iconWidth = 22
    const iconHeight = 22

    const paddingRight = parseFloat(computedStyles.paddingRight) || 0
    const marginRight = parseFloat(computedStyles.marginRight) || 0

    const top = rect.height / 2 - iconHeight / 2
    let left = 0
    if (rect.width < 300) {
      left = rect.width - iconWidth - paddingRight - marginRight - 5
    } else {
      left = rect.width - iconWidth - rect.left
    }

    modalDiv.style.left = `${rect.left}px`
    modalDiv.style.top = `${rect.top + iconHeight}px`

    icon.style.top = `${top}px`
    icon.style.left = `${left}px`
  }

  const passwordFields = document.querySelectorAll('form input[type="password"]')
  if (passwordFields.length > 0) {
    passwordFields.forEach((passwordField) => {
      const goPassIconRoot = document.createElement('div')
      goPassIconRoot.style = `position: relative !important;
                      height: 0px !important;
                      width: 0px !important;
                      float: left !important;`
      goPassIconRoot.id = 'go-pass-icon-root'
      const icon = document.createElement('img')
      icon.src = chrome.runtime.getURL('icons/icon48.png')
      icon.style = `
        position: absolute;
        cursor: pointer;
        height: 22px;
        width: 22px;
        z-index: auto;
      `
      const goPassIconRootShadow = goPassIconRoot.attachShadow({ mode: 'open' })

      icon.addEventListener('click', function () {
        chrome.storage.local.get('accessToken', (result) => {
          if (result.accessToken) {
            if (modalDiv.style.display === 'none' || modalDiv.style.display === '') {
              modalDiv.style.display = 'block'
              window.addEventListener('click', function handleClickOutside(event) {
                if (!modalDiv.contains(event.target) && event.target !== icon) {
                  modalDiv.style.display = 'none'
                  window.removeEventListener('click', handleClickOutside)
                }
              })
            } else {
              modalDiv.style.display = 'none'
            }
          } else {
            chrome.runtime.sendMessage({ action: 'openPopup' })
          }
        })
      })

      goPassIconRootShadow.appendChild(icon)
      passwordField.parentNode.insertBefore(goPassIconRoot, passwordField.nextSibling)

      positionIcon(icon, passwordField)

      window.addEventListener('resize', () => {
        positionIcon(icon, passwordField)
      })
    })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showFormCreateAccountIframe') {
    const formIframe = document.getElementById('go-pass-root').shadowRoot.getElementById('go-pass-form-save-account')
    if (formIframe) {
      formIframe.style.display = 'block'
      sendResponse({ status: 'success' })
    } else {
      sendResponse({ status: 'error', message: 'Iframe not found' })
    }
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'closeFormCreateAccountIframe') {
    const formIframe = document.getElementById('go-pass-root').shadowRoot.getElementById('go-pass-form-save-account')
    if (formIframe) {
      formIframe.style.display = 'none'
      sendResponse({ status: 'success' })
    } else {
      sendResponse({ status: 'error', message: 'Iframe not found' })
    }
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const goPassModalContainer = document
    .getElementById('go-pass-root')
    ?.shadowRoot.getElementById('go-pass-modal-container')

  const updateHeight = (height) => {
    if (goPassModalContainer) {
      goPassModalContainer.style.height = height
      sendResponse({ status: 'success' })
    } else {
      sendResponse({ status: 'error', message: 'goPassModalContainer not found' })
    }
  }

  switch (message.action) {
    case 'showMoreOptions':
      updateHeight('21vh')
      break
    case 'showModalGeneratePassword':
      updateHeight('43vh')
      break
    case 'noShowMoreOptions':
      updateHeight('13vh')
      break
    default:
      goPassModalContainer.style.display = 'none'
  }

  return true
})
