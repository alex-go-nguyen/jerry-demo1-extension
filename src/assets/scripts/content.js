const helperFunction = {
  createElement: (tag, id, styles, parent = null) => {
    const element = document.createElement(tag)
    if (id) element.id = id
    if (styles) element.style = styles
    if (parent) parent.appendChild(element)
    return element
  },
  handleIconPosition: (modalDiv, icon, passwordField) => {
    const rect = passwordField.getBoundingClientRect()
    const iconHeight = 22
    const top = rect.height / 2 - iconHeight / 2
    modalDiv.style.left = `${rect.left}px`
    modalDiv.style.top = `${rect.top + rect.height}px`
    icon.style.top = `${top}px`
  },
  updateIframeDisplay: (translateY) => {
    const iframe = document.getElementById('go-pass-root').shadowRoot.getElementById('go-pass-form-save-account')
    if (iframe) {
      iframe.style.transform = translateY
      return { status: 'success' }
    } else {
      return { status: 'error', message: 'Iframe not found' }
    }
  },
  updateHeight: (height) => {
    const goPassModalContainer = document
      .getElementById('go-pass-root')
      .shadowRoot.getElementById('go-pass-modal-container')
    if (goPassModalContainer) {
      goPassModalContainer.style.height = height
      return { status: 'success' }
    } else {
      return { status: 'error', message: 'goPassModalContainer not found' }
    }
  },
  sendRequestConfirmSaveAccount: (credential, password) => {
    chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, (response) => {
      if (response?.url) {
        currentUrl = response.url.split('/')[2]
      }
    })
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: 'formSubmit',
        credential: credential,
        password: password,
        domain: currentUrl
      })
    }, 3000)
  },
  fillAccountToInputFields: (request) => {
    const { username, password } = request
    const passwordField = document.querySelector('form input[type="password"]')
    const formField = document.querySelector('form input[type="password"]').closest('form')

    if (formField) {
      const credentialField = formField.querySelector('input:not([type="password"])')

      const changeEvent = new Event('change', { bubbles: true })

      credentialField.addEventListener('change', function () {
        credentialField.value = username
      })

      passwordField.addEventListener('change', function () {
        passwordField.value = password
      })

      credentialField.dispatchEvent(changeEvent)
      passwordField.dispatchEvent(changeEvent)
    }
  },
  fillPassword: (request) => {
    const { password } = request
    document.querySelectorAll('form input[type="password"]').forEach((passwordField) => {
      if (passwordField) {
        const changeEvent = new Event('change', { bubbles: true })

        passwordField.addEventListener('change', function () {
          passwordField.value = password
        })
        passwordField.dispatchEvent(changeEvent)
      }
    })
  }
}
const actions = {
  showFormCreateAccountIframe: (request) => helperFunction.updateIframeDisplay('translateY(0px)'),
  closeFormCreateAccountIframe: (request) => helperFunction.updateIframeDisplay('translateY(-500px)'),
  updateHeight: (request) => helperFunction.updateHeight(request.height),
  fillForm: (request) => helperFunction.fillAccountToInputFields(request),
  fillPassword: (request) => helperFunction.fillPassword(request)
}
window.addEventListener('load', async function () {
  const goPassRoot = helperFunction.createElement(
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

  const modalDiv = helperFunction.createElement(
    'div',
    'go-pass-modal-container',
    `
    position: absolute; 
    display: none;
    width: 100vw;
    height: 387px;
    max-height: 400px;
    z-index: 2147483647;
    border-radius: 4px;
    max-width: 280px;
    background: radial-gradient(circle at 146.297px 0%, rgb(251, 235, 235) 1.47%, rgb(249, 250, 251) 20.77%);
    border: 1px solid rgb(213, 217, 222);
    box-shadow: rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.04) 0px 4px 8px;
  `,
    goPassShadowRoot
  )

  const modalIframe = helperFunction.createElement(
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

  const formSaveAccount = helperFunction.createElement(
    'iframe',
    'go-pass-form-save-account',
    `
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 2147483647;
    border: none;
    height: 100vh;
    width: 100vw;
    max-height: 500px;
    max-width: 430px;
    transform: translateY(-500px);
    transition: transform 600ms cubic-bezier(0.2, 1.35, 0.7, 0.95);
  `,
    goPassShadowRoot
  )
  formSaveAccount.src = chrome.runtime.getURL('index.html#/create-account')
  const goPassIconRoot = helperFunction.createElement(
    'div',
    'go-pass-icon-root',
    `
      position: relative !important; height: 0px !important; width: 0px !important; float: right !important;
    `
  )

  const goPassIconRootShadow = goPassIconRoot.attachShadow({ mode: 'open' })

  const passwordFields = this.document.querySelectorAll('input[type="password"]')
  if (passwordFields) {
    const lastPasswordField = passwordFields[passwordFields.length - 1]

    if (lastPasswordField) {
      const formField = lastPasswordField.closest('form')

      if (formField) {
        formField.addEventListener('submit', (e) => {
          const credentialField = formField.querySelector(
            'input:not([type="password"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"])'
          )
          helperFunction.sendRequestConfirmSaveAccount(credentialField.value, lastPasswordField.value)
          const authData = {
            credential: credentialField.value,
            password: lastPasswordField.value
          }
          this.chrome.storage.local.set({ authData: authData })
        })
      }
      const parentNode = lastPasswordField.parentElement
      parentNode.insertBefore(goPassIconRoot, lastPasswordField.nextSibling)
    }

    const icon = helperFunction.createElement(
      'img',
      null,
      `
        position: absolute; cursor: pointer; height: 22px; width: 22px; z-index: auto;
      `,
      goPassIconRootShadow
    )
    icon.src = chrome.runtime.getURL('icons/icon48.png')
    icon.style.left = '-40px'
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
    if (lastPasswordField) {
      helperFunction.handleIconPosition(modalDiv, icon, lastPasswordField)
      window.addEventListener('resize', () => helperFunction.handleIconPosition(modalDiv, icon, lastPasswordField))
    }
  }
  const response = await this.chrome.storage.local.get('authData')
  if (response && response?.authData) {
    helperFunction.sendRequestConfirmSaveAccount(response?.authData.credential, response?.authData.password)
    this.chrome.storage.local.remove('authData')
  }
})
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const actionHandler =
    actions[message.action] ||
    (() => {
      const goPassModalContainer = document
        .getElementById('go-pass-root')
        .shadowRoot.getElementById('go-pass-modal-container')
      if (goPassModalContainer) goPassModalContainer.style.display = 'none'
    })
  sendResponse(actionHandler(message))
  return true
})
