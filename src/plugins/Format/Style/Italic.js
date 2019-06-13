import Plugin from '@/contracts/Plugin'
import Button from '@/contracts/Button'

export default class Italic extends Plugin {
  buttons = [
    new Button('italic', 'italic.toggle', 'format_italic')
  ]

  toggle() {
    document.execCommand('italic', false, '')
  }
}