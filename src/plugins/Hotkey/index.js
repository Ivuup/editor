import Plugin from "../../contracts/Plugin";
import View from "./ui";
import { Command } from "./domain/Command";

// TODO: Implementar
export default class Hotkey extends Plugin {
  prefix = "hotkey";

  // regexMarkers
  regex;
  regexWord;
  current = new Command();
  currentList;
  currentIndex = {
    start: null,
    node: null,
    end: null
  };
  _loadedComponents = [];

  constructor(core) {
    super(core);
    // preparar regex de acordo com os marcadores
    let markers = `[${this.core.config.hotkey.map(m => m.marker).join("|")}]`;
    // /[@]\S*(?:\([\w|\W]*(?:\))|\S*(?:\([\w|\W]*))|\S*/
    this.regex = new RegExp(
      `(?!\\b)${markers}(?:\\S*(?:\\([\\w|\\W]*(?:\\))|\\S*(?:\\([\\w|\\W]*))|\\S*)`,
      "g"
    );

    this.regexWord = new RegExp(`^${markers}[\\w]*[\\)]?`);
    // varrer o conteúdo e renderizar os componentes
  }
  loaded() {
    // varrer o conteúdo e renderizar os componentes
    this.loadComponents();
  }
  onKeydown(event) {
    this._checkActions(event);
  }

  onKeyup(event) {
    this.core._floatAction.value = false;

    if (
      this.core.selection.focusNode.nodeName != "#text" ||
      event.key == "Escape" ||
      this.core.readOnly.active ||
      !this.core.selection.focusNode.data
    )
      return;

    // verifica se existe um marcador
    this.regex.lastIndex = 0;
    let match = this.regex.exec(this.core.selection.focusNode.data);

    this.currentIndex = {};
    this.current.fill("");

    while (match) {
      if (
        match.index < this.core.selection.focusOffset &&
        match.index + match[0].length >= this.core.selection.focusOffset
      ) {
        // salvando a posicao do marcador
        this.currentIndex = {
          start: match.index,
          node: this.core.selection.focusNode,
          end: match.index + match[0].length
        };
        this.current.fill(match[0]);
        break;
      }
      match = this.regex.exec(this.core.selection.focusNode.data);
    }

    if (!this.regexWord.test(this.current._raw))
      return (this.core._floatAction.value = false);
    this.core._floatAction.value = true;

    // pegar o marcador correto
    let marker = this._getMarker(this.current._raw);

    // pesquisar lista
    if (
      !marker.typing ||
      !Object.keys(marker.typing)
        .filter(i => i == this.current.hotkey || i == this.current.name)
        .some(i => {
          let r = marker.typing[i]({
            command: this.current,
            marker,
            hotkey: this
          });
          return typeof r == "function" ? r(...this.current.params) : r;
        })
    ) {
      const exp = new RegExp(this.current._raw.slice(1).trim(), "i");
      this.currentList = marker.items
        .filter(i => !i.hide && (exp.test(i.name) || exp.test(i.raw)))
        .sort(a => {
          const test = (a.name + a.raw).match(exp);
          return test ? -test.length : 1;
        });
    }

    // renderizar layout e abrir menu
    this.core._floatAction.component = marker.view || View;
    this.core._floatAction.value = this.currentList.length > 0;
  }

  _getMarker(word) {
    return this.core.config.hotkey.find(m => m.marker == word.slice(0, 1));
  }

  _checkActions(event) {
    // verificando se menu esta ativo
    if (!this.core._floatAction.value) return;

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.core._floatAction.value = false;
        break;
      default:
        this.core._floatAction.menu.changeListIndex(event);
        break;
    }
  }

  /**
   * Executado quando um item da lista é selecionado
   *
   * @param {Element} editor
   * @param {Object} item
   */
  selectedItem(editor, item) {
    // caso item nao tenha click
    if (!item.render) return;

    // separando e pegando nó do comando
    this.currentIndex.node = this.core.selection.focusNode;
    if (
      this.currentIndex.node instanceof Element &&
      this.currentIndex.node.innerText.trim() == ""
    ) {
      this.currentIndex.node = document.createTextNode("");
      this.core.selection.focusNode.prepend(this.currentIndex.node);
    } else {
      this.currentIndex.node.splitText(this.currentIndex.end);
      this.currentIndex.node = this.currentIndex.node.splitText(
        this.currentIndex.start
      );
    }

    // setando o cursor no final do comando
    window
      .getSelection()
      .setPosition(this.currentIndex.node, this.currentIndex.node.data.length);

    // adicionando elemento da hotkey
    let createElement = (nodeName = "span", customElement) => {
      let element;
      // caso nao tenha um elemento customizado, cria um novo para controle do hotkey
      if (!customElement) {
        element = document.createElement(nodeName);
        element.className = `hotkey ${item.class || ""}`;
        element.contentEditable = false;
        element.dataset.item = item.raw;
      }

      // adiciona o elemento ao editor
      this.currentIndex.node.parentElement.insertBefore(
        customElement || element,
        this.currentIndex.node
      );

      this.currentIndex.node.remove();

      // retorna o elemento alvo
      return (
        customElement || element.appendChild(document.createElement("span"))
      );
    };

    // adicionando o texto posterior da hotkey
    if (this.core.selection.focusNode.data)
      this.core.selection.focusNode.data = this.core.selection.focusNode.data.slice(
        this.currentIndex.end + 1
      );

    let parent = this.currentIndex.node.parentElement;

    // executando acao da hotkey
    item.render(this.core, createElement, this.currentIndex.node);

    // normalizando os nós
    parent.normalize();

    setTimeout(() => {
      this.core.editor.dispatchEvent(new Event("input"));
      this.core.editor.dispatchEvent(new Event("click"));
    }, 1);
  }

  /**
   * Carrega os componentes do texto com as informacoes da lista
   *
   * TODO: rodar essa funcao quando ocorrer alteracao na lista
   */
  async loadComponents() {
    let hotkeys = this.core.editor.querySelectorAll(".hotkey");

    for (let i = 0; i < hotkeys.length; i++) {
      if (
        this._loadedComponents.includes(hotkeys[i]) ||
        !hotkeys[i].dataset.item
      )
        continue;
      // pega o marcador
      let item = this._getMarker(hotkeys[i].dataset.item);

      // roda funcao antes de tentar renderizar
      let command = new Command(hotkeys[i].dataset.item);
      if (item.beforeRender) {
        let toRun = Object.keys(item.beforeRender).filter(
          i => i == command.hotkey || i == command.name
        );
        for (let tr = 0; tr < toRun.length; tr++) {
          let r = item.beforeRender[toRun[tr]]({
            command: command,
            marker: item,
            hotkey: this
          });
          await (typeof r == "function" ? r(...command.params) : r);
        }
      }

      if (!item) continue;
      // pega o item
      item = item.items.find(item => item.raw == hotkeys[i].dataset.item);
      if (!item) continue;
      hotkeys[i].innerHTML = null;
      // executando acao da hotkey
      let result = item.render(this.core, () =>
        hotkeys[i].appendChild(document.createElement("span"))
      );
      if (!result) continue;
      if (typeof result == "string") hotkeys[i].innerHTML = result;

      this._loadedComponents.push(hotkeys[i]);
    }
  }

  /**
   * Altera uma lista de items de um marcador
   *
   * @param {Element} editor
   * @param {String} marker
   * @param {Array} items
   */
  setItemsToMarker(editor, marker, items) {
    marker = this._getMarker(marker);
    if (marker) marker.items = items;
    this.loadComponents();
  }
}
