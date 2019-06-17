import Plugin from '@/contracts/Plugin'

export default class Upload extends Plugin {
  regex = /file:\/\/\/[\w|\W]*/
  onPaste(event) {
    let text = event.clipboardData.getData('TEXT')
    if (this.regex.test(text)) {
      event.preventDefault()
      text = this.regex.exec(text)[0]

      // TODO: Concluir
      document.execCommand('insertImage', false, text)
    }
  }

  /**
   * Faz a requisição na api
   * 
   * @param {String} url 
   * @param {Function} success 
   * @param {Function} error 
   */
  _httpRequest(url, success, error) {
    const http = new XMLHttpRequest()
    http.open('GET', url, false)
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200) {
           success(http.responseText)
         }
      if (http.readyState === 4 && http.status === 500) {
           error()
         }
    }
    http.send()
  }
}