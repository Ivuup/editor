import Plugin from '@/contracts/Plugin'

export default class Preview extends Plugin {
  regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  url = ""
  apiUrl = "https://linkpreview-api.herokuapp.com/"
  response
  lastText = ""
  lastNode

  input(event) {
    if (event.inputType != "insertText") return

    if (event.data && event.data != " ") {
      this.lastNode = this.core.selection.focusNode
      this.lastNode = this.lastNode.parentNode == this.core.editor ? this.lastNode : this.lastNode.parentNode
      this.lastText = this.core.selection.focusNode.innerText || this.core.selection.focusNode.textContent
      return
    }
    if (!this.regex.test(this.lastText) || this.lastNode.previousSibling && this.lastNode.previousSibling.className == "link-preview") {
      this.lastNode = null
      this.lastText = null
      return
    }
    this.url = this.regex.exec(this.lastText)[0]
    this.getLinkPreview()
  }

  getLinkPreview() {
    this.httpRequest((response) => {
      response = JSON.parse(response)
      let preview = document.createElement('a')
      preview.className = 'link-preview'
      preview.contentEditable = false
      preview.href = response.url
      preview.target = '_blank'
      preview.innerHTML = `
        <div class="wrap">
          <img src="${response.images[0]}" class="preview-image" />
          <div>
            <h3 class="preview-title">${response.title}</h3>
            <span class="preview-description">${response.description}</span>
          </div>
        </div>
      `
      this.core.editor.insertBefore(preview, this.lastNode)
    })
    this.url = null
    this.lastText = null
  }
  
  httpRequest(success, error) {
    const http = new XMLHttpRequest()
    const params = 'url=' + this.url
    http.open('POST', this.apiUrl, true)
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200) {
           success(http.responseText)
         }
      if (http.readyState === 4 && http.status === 500) {
           error()
         }
    }
    http.send(params)
  }
}