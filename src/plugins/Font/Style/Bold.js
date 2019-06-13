import {Plugin} from '@/contracts/Plugin'

export class Bold extends Plugin {
  buttons = [
    {
      icon: 'format_bold',
      name: 'bold',
      command: 'bold.toggle'
    }
  ]

  toggle() {
    document.execCommand('bold', false, '')
  }
}