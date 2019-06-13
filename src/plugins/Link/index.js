import Plugin from '@/contracts/Plugin'
import Button from '@/contracts/Button'

export default class Link extends Plugin {
  buttons = [
    new Button('link', 'link.create', 'link')
  ]

  create() {
    let url = prompt("Digite a URL");
    
    if (!url)
      return 

    if (!/^http/.test(url))
      url = 'https://' + url
    
      document.execCommand('createLink', false, url)
  }
}