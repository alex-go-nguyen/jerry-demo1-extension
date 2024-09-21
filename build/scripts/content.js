window.addEventListener('load', function () {
  const rootDiv = this.document.createElement('div')
  rootDiv.id = 'root-div'
  rootDiv.style = `   
  position: absolute !important;
  top: 0px !important;
  left: 0px !important;
  height: 0px !important;
  width: 0px !important;`
  this.document.body.append(rootDiv)

  const modalDiv = this.document.createElement('div')
  modalDiv.style = `
   position: absolute; 
   display: none;
   height: 100vh;
   width: 100vw;
   z-index: 2147483647;
   border-radius: 4px;
   top: 371.75px;
   left: 63.5px;
   max-height: 115px;
   max-width: 280px;
   min-width: auto;
   background: radial-gradient(circle at 146.297px 0%, rgb(251, 235, 235) 1.47%, rgb(249, 250, 251) 20.77%);
   border: 1px solid rgb(213, 217, 222);
   box-shadow: rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.08) 0px 2px 4px, rgba(29, 48, 73, 0.04) 0px 4px 8px;`
  const shadow = rootDiv.attachShadow({ mode: 'open' })
  shadow.appendChild(modalDiv)

  const iframe = document.createElement('iframe')
  iframe.src = chrome.runtime.getURL('index.html#/webclient-infield')
  iframe.id = 'test-id'
  iframe.style = `border: none;
                  height: 100%;
                  width: 100%;`
  modalDiv.appendChild(iframe)

  const loginForms = document.querySelectorAll('form input[type="text"], form input[type="password"]')
  if (loginForms.length > 0) {
    loginForms.forEach((input) => {
      const parent = input.closest('div')
      if (parent) {
        const newDiv = document.createElement('div')
        newDiv.style = `position: relative !important;
                        height: 0px !important;
                        width: 0px !important;
                        float: left !important;`
        const icon = document.createElement('img')
        icon.src = chrome.runtime.getURL('icons/icon48.png')
        icon.style = `  position: absolute;
                        cursor: pointer;
                        height: 22px;
                        max-height: 22px;
                        width: 22px;
                        max-width: 22px;
                        top: -45px;
                        left: 165.312px;
                        z-index: auto`

        icon.addEventListener('click', function () {
          const accessToken = chrome.storage.local.get('accessToken')
          if (accessToken) {
            modalDiv.style.display = 'block'
          } else {
            chrome.runtime.sendMessage({ action: 'openPopup' })
          }
        })
        newDiv.appendChild(icon)
        parent.appendChild(newDiv)
      }
    })
  }
})
