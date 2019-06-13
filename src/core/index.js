String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

import Layout from '@/ui/layout'
import {Plugin} from '@/contracts/Plugin'

export default class {
  plugins = {}
  element
  layout
  selection

  /**
   * Constrói a base do editor
   * @param {*} options 
   */
  constructor({ element, layout, innerHTML, plugins }) {
    this.element = element
    this.layout = layout || Layout
    this.element.innerHTML = innerHTML || null
    this.element.contentEditable = true
    this.addPlugin(...plugins)

    this.element.addEventListener('keydown', this._handleKeydown.bind(this))
    this.element.addEventListener('keyup', this._handleInput.bind(this))
  }

  /**
   * Executa um comando de um plugin
   * e.g. command = pluginName.command
   * @param {String} command 
   */
  exec(command) {
    let pluginName = /^\w*/.exec(command)[0].capitalize()
    let plugin = this.plugins[pluginName]

    if (!plugin)
      throw new Error('Plugin not found')

    return plugin.exec(command.slice(pluginName.length+1), this.element)
  }

  _handleKeydown(event) {
    Object.keys(this.plugins).forEach(plugin => 
      this.plugins[plugin].keydown ? this.plugins[plugin].keydown(event) : null
    )
  }

  _handleInput(event) {
    this.selection = null
    this.selection = window.getSelection()
  }

  addPlugin(...plugins) {
    plugins.forEach(plugin => {
      if (!(plugin instanceof Plugin))
        throw new Error('This Object is not an instanceof Plugin')
      // TODO: preparar botoes, eventos etc
      this.plugins[plugin.constructor.name] = plugin
    })
  }
}
