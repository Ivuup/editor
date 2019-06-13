export default class Button {
  name
  command
  icon
  title
  
  constructor(name, command, icon, title) {
    this.name = name
    this.command = command
    this.icon = icon
    this.title = title
  }
}