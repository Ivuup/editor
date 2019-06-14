import Plugin from '@/contracts/Plugin'
import Button from '@/contracts/Button'

export default class Link extends Plugin {
  buttons = [
    new Button('link', 'link.create', 'link')
  ]

  create(url) {
    if (typeof url != 'string')
      url = prompt("Digite a URL")
    
    if (!url)
      return 

    if (!/^http/.test(url))
      url = 'https://' + url
    
    let previewPlugin = this.core.plugins['Preview']
    if (previewPlugin)
      previewPlugin.getLinkPreview(url, this.core.selection.focusNode)
    else
      document.execCommand('createLink', false, url)
  }
}