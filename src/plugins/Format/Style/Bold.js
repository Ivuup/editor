import Plugin from '@/contracts/Plugin'
import Button from '@/contracts/Button'

export default class Bold extends Plugin {
  buttons = [
    new Button('bold', 'bold.toggle', 'format_bold')
  ]

  toggle() {
    document.execCommand('bold', false, '')
  }
}