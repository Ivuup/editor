import Layout from "../ui/layout";
import Plugin from "../contracts/Plugin";
import Button from "../contracts/Button";
import parserElement from "../utils/parseElement";
import currentWord from "../utils/currentWord";

export default class {
  plugins = {};
  editor;
  layout;
  readOnly = {
    status: false
    // loadPlugins: []
  };
  selection;
  enabledButtons = {};
  config;
  _floatAction = {};
  delayInput = 1000;
  _editing = null;
  _helpers = {
    currentWord: {}
  };

  /**
   * Constrói a base do editor
   *
   * @param {*} options
   */
  constructor({ editor, layout, innerHTML, plugins, config }) {
    this.editor = editor;
    this.layout = layout || Layout;
    this.editor.innerHTML = innerHTML;
    this._configurations(config);
    this.addPlugin(...plugins);

    this.editor.addEventListener("click", this._handleClickAndKeyup.bind(this));
    this.editor.addEventListener("keydown", this._handleKeydown.bind(this));
    this.editor.addEventListener("keyup", this._handleClickAndKeyup.bind(this));
    this.editor.addEventListener("input", this._handleInput.bind(this));
    this.editor.addEventListener("paste", this._handlePaste.bind(this));
    this.editor.addEventListener("blur", this._handleBlur.bind(this));

    setTimeout(() => {
      this._handleLoaded();
    }, 1);
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
    this._checkDeleteEvents(event);
    this._helpers.currentWord = currentWord();

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

  _handleLoaded() {
    Object.keys(this.plugins).forEach(plugin =>
      this.plugins[plugin].loaded ? this.plugins[plugin].loaded() : null
    );
  }

  _handleInput(event) {
    this._checkSelection(event);

    if (this._editing == null) this.editingCallback(true);

    if (this._editing) clearTimeout(this._editing);

    this._editing = setTimeout(() => {
      this._addLine();
      this.inputCallback([this.editor.innerHTML]);
      this.editingCallback(false);
      this._editing = null;
    }, this.delayInput);

    Object.keys(this.plugins).forEach(plugin =>
      this.plugins[plugin].onInput ? this.plugins[plugin].onInput(event) : null
    );
  }

  _handleClickAndKeyup(event) {
    this.selection = null;
    this.selection = window.getSelection();

    this._helpers.currentWord = currentWord();

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

    // ativa ou desativa o editor
    this.setReadOnly(config.readOnly ? config.readOnly.status : false);

    // configura a adição da ultima linha
    this.config.autoAddLine =
      this.config.autoAddLine == undefined ? true : this.config.autoAddLine;

    this._floatAction = { value: false };
    // atribui foco ao editor ao iniciar
    if (this.config.autofocus) {
      this.editor.focus();
    }
    // mostra texto caso o editor esteja vazio
    this.editor.setAttribute("placeholder", config.placeholder);
  }

  setContent(content) {
    let clone = this.editor.cloneNode();
    clone.innerHTML = content;
    parserElement(this.editor, clone);
  }

  _addLine() {
    if (
      this.config.autoAddLine &&
      (!this.editor.lastChild ||
        !!this.editor.lastChild.innerText ||
        !!this.editor.lastChild.data)
    )
      this.editor.append(document.createElement("p"));
  }

  setReadOnly(bool) {
    this.readOnly.status = !!bool;
    this.editor.designMode = !bool;
    this.editor.contentEditable = !bool;

    if (bool) {
      this.editor.classList.remove("editable");
      this.editor.classList.add("read-only");
    } else {
      this.editor.classList.remove("read-only");
      this.editor.classList.add("editable");
    }

    // TODO: carregar apenas os plugins necessarios no momento
    // if (this.readOnly.status && this._unloadedPlugins && this._unloadedPlugins.length > 0) {
    //   this.addPlugin(...this._unloadedPlugins)
    //   this._unloadedPlugins = []
    // }
  }

  _checkDeleteEvents(event) {
    // verifica se é uma tecla de exclusão
    if (!event.key || !["Backspace", "Delete"].includes(event.key)) return;

    let selection = window.getSelection();
    let toRemove = null;

    // pega o elemento a ser removido caso a posicao esteja no final e use delete
    if (
      (selection.focusOffset === selection.focusNode.length ||
        selection.focusNode.length == undefined) &&
      event.key === "Delete"
    ) {
      let children = Array.from(
        selection.focusNode.parentElement.childNodes
      ).filter(c => c.nodeName == "#text");
      if (
        !(selection.focusNode instanceof Element) &&
        children.indexOf(selection.focusNode) === children.length - 1
      )
        toRemove = selection.focusNode.parentElement.nextSibling
          ? selection.focusNode.parentElement.nextSibling.firstChild
          : null;
      else
        toRemove = selection.focusNode.nextSibling
          ? selection.focusNode.nextSibling.firstChild
          : selection.focusNode.parentElement.nextSibling;
    }

    // pega o elemento a ser removido caso a posicao esteja no inicio e use backspace
    else if (selection.focusOffset === 0 && event.key === "Backspace")
      toRemove = selection.focusNode.previousElementSibling;

    toRemove = this._getFirstEditableIfExists(toRemove);
    // retorna sem remover caso nao esteja declarado ou fora do editor
    if (
      !toRemove ||
      !this.editor.contains(toRemove) ||
      toRemove.isContentEditable ||
      !(toRemove instanceof Element)
    )
      return;

    // previne o evento e remove elemento
    event.preventDefault();
    toRemove.remove();
  }

  _checkSelection(event) {
    if (
      window.getSelection().focusNode.parentElement !== this.editor ||
      event.inputType !== "insertText" ||
      event.data == null
    )
      return;

    let p = document.createElement("p");
    this.editor.insertBefore(p, window.getSelection().focusNode);
    p.append(window.getSelection().focusNode);

    let range = new Range();
    range.selectNode(p.firstChild);
    range.setStart(p.firstChild, p.firstChild.length);
    range.collapse(true);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }

  _getFirstEditableIfExists(element) {
    if (
      !element ||
      element.isContentEditable ||
      !element.parentElement ||
      element.parentElement.isContentEditable
    )
      return element;

    return this._getFirstEditableIfExists(element.parentElement);
  }
}
