export default class Button {
  name
  command
  icon
  title
  active
  
  constructor(name, commandOrButtons, icon, title, active = false) {
    this.name = name
    this.command = commandOrButtons
    this.icon = icon
    this.title = title
    this.active = active
  }
}