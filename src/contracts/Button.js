export default class Button {
  name
  command
  icon
  title
  
  constructor(name, commandOrButtons, icon, title) {
    this.name = name
    this.command = commandOrButtons
    this.icon = icon
    this.title = title
  }
}