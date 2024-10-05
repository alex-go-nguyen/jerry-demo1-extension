window.addEventListener('load', function () {
  const createElement = (tag, id, styles, parent = null) => {
    const element = document.createElement(tag)
    if (id) element.id = id
    if (styles) element.style = styles
    if (parent) parent.appendChild(element)
    return element
  }

  const goPassRoot = createElement(
    'div',
    'go-pass-root',
    `
    position: absolute !important;
    top: 0px !important;
    left: 0px !important;
    height: 0px !important;
    width: 0px !important;
  `,
    document.body
  )
  const goPassShadowRoot = goPassRoot.attachShadow({ mode: 'open' })

  const modalDiv = createElement(
    'div',
    'go-pass-modal-container',
    `
    position: absolute; 
    display: none;
    width: 100vw;
    height: 124px;
    z-index: 2147483647;
    border-radius: 4px;
    max-width: 280px;
    background: radial-gradient(circle at 146.297px 0%, rgb(251, 235, 235) 1.47%, rgb(249, 250, 251) 20.77%);
    border: 1px solid rgb(213, 217, 222);
    box-shadow: rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.04) 0px 4px 8px;
  `,
    goPassShadowRoot
  )

  const modalIframe = createElement(
    'iframe',
    'go-pass-modal-option',
    `
    border: none;
    height: 100%;
    width: 100%;
  `,
    modalDiv
  )
  modalIframe.src = chrome.runtime.getURL('index.html#/webclient-infield')
  modalIframe.allow = 'clipboard-write'

  const formSaveAccount = createElement(
    'iframe',
    'go-pass-form-save-account',
    `
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
  `,
    goPassShadowRoot
  )
  formSaveAccount.src = chrome.runtime.getURL('index.html#/create-account')

  const handleIconPosition = (icon, passwordField) => {
    const rect = passwordField.getBoundingClientRect()
    const computedStyles = window.getComputedStyle(passwordField)
    const iconWidth = 22,
      iconHeight = 22
    const paddingRight = parseFloat(computedStyles.paddingRight) || 0
    const marginRight = parseFloat(computedStyles.marginRight) || 0
    const top = rect.height / 2 - iconHeight / 2
    const left =
      rect.width < 300 ? rect.width - iconWidth - paddingRight - marginRight - 5 : rect.width - iconWidth - rect.left
    modalDiv.style.left = `${rect.left}px`
    modalDiv.style.top = `${rect.top + iconHeight}px`
    icon.style.top = `${top}px`
    icon.style.left = `${left}px`
  }

  document.querySelectorAll('form input[type="password"]').forEach((passwordField) => {
    const goPassIconRoot = createElement(
      'div',
      'go-pass-icon-root',
      `
      position: relative !important; height: 0px !important; width: 0px !important; float: left !important;
    `,
      passwordField.parentNode
    )

    const icon = createElement(
      'img',
      null,
      `
      position: absolute; cursor: pointer; height: 22px; width: 22px; z-index: auto;
    `,
      goPassIconRoot.attachShadow({ mode: 'open' })
    )
    icon.src = chrome.runtime.getURL('icons/icon48.png')

    icon.addEventListener('click', () => {
      chrome.storage.local.get('accessToken', (result) => {
        if (result.accessToken) {
          modalDiv.style.display = modalDiv.style.display === 'none' || modalDiv.style.display === '' ? 'block' : 'none'
          if (modalDiv.style.display === 'block') {
            const handleClickOutside = (event) => {
              if (!modalDiv.contains(event.target) && event.target !== icon) {
                modalDiv.style.display = 'none'
                window.removeEventListener('click', handleClickOutside)
              }
            }
            window.addEventListener('click', handleClickOutside)
          }
        } else {
          chrome.runtime.sendMessage({ action: 'openPopup' })
        }
      })
    })
    window.addEventListener('resize', () => handleIconPosition(icon, passwordField))
  })

  const updateIframeDisplay = (action, display) => {
    const iframe = document.getElementById('go-pass-root').shadowRoot.getElementById(action)
    if (iframe) {
      iframe.style.display = display
      return { status: 'success' }
    } else {
      return { status: 'error', message: 'Iframe not found' }
    }
  }

  const actions = {
    showFormCreateAccountIframe: () => updateIframeDisplay('go-pass-form-save-account', 'block'),
    closeFormCreateAccountIframe: () => updateIframeDisplay('go-pass-form-save-account', 'none'),
    showMoreOptions: () => updateHeight('193px'),
    showModalGeneratePassword: () => updateHeight('400px'),
    noShowMoreOptions: () => updateHeight('124px')
  }

  const updateHeight = (height) => {
    const goPassModalContainer = document
      .getElementById('go-pass-root')
      .shadowRoot.getElementById('go-pass-modal-container')
    if (goPassModalContainer) {
      goPassModalContainer.style.height = height
      return { status: 'success' }
    } else {
      return { status: 'error', message: 'goPassModalContainer not found' }
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const actionHandler =
      actions[message.action] ||
      (() => {
        const goPassModalContainer = document
          .getElementById('go-pass-root')
          .shadowRoot.getElementById('go-pass-modal-container')
        if (goPassModalContainer) goPassModalContainer.style.display = 'none'
      })
    sendResponse(actionHandler())
    return true
  })
})



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillForm') {
    const { username, password } = message
    const passwordField = document.querySelector('form input[type="password"]')
    const usernameField = document
      .querySelector('form input[type="password"]')
      .closest('form')
      .querySelector('input[type="text"]')
    usernameField.value = username
    passwordField.value = password
  }
  sendResponse({ status: 'success' })
  return true
})
