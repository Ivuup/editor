import Layout from "../ui/layout";
import Plugin from "../contracts/Plugin";
import Button from "../contracts/Button";
import parserElement from "../utils/parseElement";

export default class {
  plugins = {};
  editor;
  layout;
  selection;
  enabledButtons = {};
  config;
  _floatAction = {};
  delayInput = 1000;
  _editing = null;

  /**
   * Constrói a base do editor
   *
   * @param {*} options
   */
  constructor({ editor, layout, innerHTML, plugins, config }) {
    this.editor = editor;
    this.layout = layout || Layout;
    this.editor.innerHTML = innerHTML ? innerHTML : "<p></p>";
    this.editor.designMode = true;
    this.editor.contentEditable = true;
    this._configurations(config);
    this.addPlugin(...plugins);

    this.editor.addEventListener("click", this._handleClickAndKeyup.bind(this));
    this.editor.addEventListener("keydown", this._handleKeydown.bind(this));
    this.editor.addEventListener("keyup", this._handleClickAndKeyup.bind(this));
    this.editor.addEventListener("input", this._handleInput.bind(this));
    this.editor.addEventListener("paste", this._handlePaste.bind(this));
    this.editor.addEventListener("blur", this._handleBlur.bind(this));
  }

  /**
   * Executa um comando de um plugin
   *
   * e.g. command = pluginName.command
   * @param {String} command
   */
  exec(command, ...options) {
    let pluginName = /^\w*/.exec(command)[0].toLowerCase();
    let plugin = this.plugins[pluginName];

    if (!plugin) throw new Error("Plugin not found");

    return plugin.exec(
      command.slice(pluginName.length + 1),
      this.editor,
      ...options
    );
  }

  _handleKeydown(event) {
    this.selection = null;
    this.selection = window.getSelection();
    Object.keys(this.plugins).forEach(plugin =>
      this.plugins[plugin].onKeydown
        ? this.plugins[plugin].onKeydown(event)
        : null
    );
  }

  _handlePaste(event) {
    Object.keys(this.plugins).forEach(plugin =>
      this.plugins[plugin].onPaste ? this.plugins[plugin].onPaste(event) : null
    );
  }

  _handleInput(event) {
    if (this._editing == null) this.editingCallback(true);

    if (this._editing) clearTimeout(this._editing);

    this._editing = setTimeout(() => {
      this.inputCallback([this.editor.innerHTML]);
      this.editingCallback(false);
      this._editing = null;
    }, this.delayInput);

    Object.keys(this.plugins).forEach(plugin =>
      this.plugins[plugin].onInput ? this.plugins[plugin].onInput(event) : null
    );
  }

  _handleClickAndKeyup(event) {
    if (!this.editor.innerHTML)
      this.editor.innerHTML = `<p placeholder="${
        this.config.placeholder
      }"></p>`;
    this.selection = null;
    this.selection = window.getSelection();

    Object.keys(this.plugins).forEach(plugin =>
      this.plugins[plugin].onKeyup ? this.plugins[plugin].onKeyup(event) : null
    );
  }

  _handleBlur(event) {
    this.blurCallback([this.editor.innerHTML, event]);
  }

  /**
   * Adiciona os plugins ao editor
   *
   * @param  {...Plugin} plugins
   */
  addPlugin(...plugins) {
    plugins.forEach(plugin => {
      // iniciando instância
      plugin = new plugin(this);

      if (!(plugin instanceof Plugin))
        throw new Error("Variable is not an instance of Plugin");
      // TODO: preparar botoes, eventos etc
      this.plugins[plugin.prefix.toLowerCase()] = plugin;
      this._enableButtons(plugin);
    });
  }

  /**
   * Adiciona os botões dos plugins
   *
   * @param {Plugin} plugin
   */
  _enableButtons(plugin) {
    if (!plugin.buttons) return;

    plugin.buttons.forEach(button => {
      if (!(button instanceof Button))
        throw new Error("Variable is not an instance of Button");

      this.enabledButtons[button.name] = button;
    });
  }

  _configurations(config) {
    this.config = config;
    this._floatAction = { value: false };
    // atribui foco ao editor ao iniciar
    if (this.config.autofocus) {
      this.editor.focus();
    }
    // mostra texto caso o editor esteja vazio
    if (this.editor.children[0])
      this.editor.children[0].setAttribute("placeholder", config.placeholder);
  }

  setContent(content) {
    parserElement(this.editor, content);
  }
}
