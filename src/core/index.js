String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

import Layout from '@/ui/layout'
import Plugin from '@/contracts/Plugin'
import Button from '@/contracts/Button'

export default class {
  plugins = {}
  element
  layout
  selection
  enabledButtons = {}
  config

  /**
   * Constrói a base do editor
   * 
   * @param {*} options 
   */
  constructor({ element, layout, innerHTML, plugins, config }) {
    this.element = element
    this.layout = layout || Layout
    this.element.innerHTML = innerHTML || null
    this.element.contentEditable = true
    this.config = config
    this.addPlugin(...plugins)

    this.element.addEventListener('click', this._handleClickAndKeyup.bind(this))
    this.element.addEventListener('keydown', this._handleKeydown.bind(this))
    this.element.addEventListener('keyup', this._handleClickAndKeyup.bind(this))
  }

  /**
   * Executa um comando de um plugin
   * 
   * e.g. command = pluginName.command
   * @param {String} command 
   */
  exec(command) {
    let pluginName = /^\w*/.exec(command)[0].capitalize()
    let plugin = this.plugins[pluginName]

    if (!plugin)
      throw new Error('Plugin not found')

    // Restaurando foco no editor
    this.element.focus()
    return plugin.exec(command.slice(pluginName.length+1), this.element)
  }

  _handleKeydown(event) {
    Object.keys(this.plugins).forEach(plugin => 
      this.plugins[plugin].keydown ? this.plugins[plugin].keydown(event) : null
    )
  }

  _handleClickAndKeyup(event) {
    this.selection = null
    this.selection = window.getSelection()
  }

  /**
   * Adiciona os plugins ao editor
   * 
   * @param  {...Plugin} plugins
   */
  addPlugin(...plugins) {
    plugins.forEach(plugin => {
      // iniciando instância
      plugin = new plugin
      
      if (!(plugin instanceof Plugin))
        throw new Error('This Object is not an instanceof Plugin')
      // TODO: preparar botoes, eventos etc
      this.plugins[plugin.constructor.name] = plugin
      this._enableButtons(plugin)
    })
  }

  /**
   * Adiciona os botões dos plugins
   * 
   * @param {Plugin} plugin 
   */
  _enableButtons(plugin) {
    if (!plugin.buttons)
      return

    plugin.buttons.forEach(button => {
      if (!(button instanceof Button))
        throw new Error('This Object is not an instanceof Button')
      
      this.enabledButtons[button.name] = button
    })
  }
}
