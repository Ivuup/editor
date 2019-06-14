String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

import Layout from '@/ui/layout'
import Plugin from '@/contracts/Plugin'
import Button from '@/contracts/Button'

export default class {
  plugins = {}
  editor
  layout
  selection
  enabledButtons = {}
  config

  /**
   * Constrói a base do editor
   * 
   * @param {*} options 
   */
  constructor({ editor, layout, innerHTML, plugins, config }) {
    this.editor = editor
    this.layout = layout || Layout
    this.editor.innerHTML = innerHTML || null
    this.editor.designMode = true
    this.editor.contentEditable = true
    this.config = config
    this.addPlugin(...plugins)

    this.editor.addEventListener('click', this._handleClickAndKeyup.bind(this))
    this.editor.addEventListener('keydown', this._handleKeydown.bind(this))
    this.editor.addEventListener('keyup', this._handleClickAndKeyup.bind(this))
    this.editor.addEventListener('input', this._handleInput.bind(this))
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
    this.editor.focus()

    return plugin.exec(command.slice(pluginName.length+1), this.editor)
  }

  _handleKeydown(event) {
    this.selection = null
    this.selection = window.getSelection()

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
      plugin = new plugin(this)
      
      if (!(plugin instanceof Plugin))
        throw new Error('Variable is not an instance of Plugin')
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
        throw new Error('Variable is not an instance of Button')
      
      this.enabledButtons[button.name] = button
    })
  }

  _handleInput(event) {
    Object.keys(this.plugins).forEach(plugin => 
      this.plugins[plugin].input ? this.plugins[plugin].input(event) : null
    )
  }
}
