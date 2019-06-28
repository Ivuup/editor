import Plugin from "../../contracts/Plugin";
import View from "./ui";

// TODO: Implementar
export default class Hotkey extends Plugin {
  prefix = "hotkey";

  // regexMarkers
  regex;
  regexWord;
  current;
  currentList;
  currentIndex = {
    start: null,
    end: null
  };

  constructor(core) {
    super(core);
    // preparar regex de acordo com os marcadores
    let markers = `[${this.core.config.hotkey.map(m => m.marker).join("|")}]`;
    this.regex = new RegExp(`${markers}[\\w]*`);

    this.regexWord = new RegExp(`^${markers}[\\w]*`);
    // varrer o conteúdo e renderizar os componentes
    this.loadComponents();
  }

  onKeydown(event) {
    this._checkActions(event);
  }

  onKeyup() {
    this.core._floatAction.value = false;
    // verifica se existe um marcador
    if (!this.regex.test(this.core.selection.focusNode.data)) return;

    let words = this.core.selection.focusNode.data.split(" ");
    let count = 0;
    let wordsIndex = words.map(w => {
      return {
        start: count,
        end: (() => {
          let tmp = count + w.trim().length - 1;
          count += w.length + 1;
          return tmp;
        })()
      };
    });
    // pegando o marcador atual
    this.current = words.find((w, i) => {
      if (
        wordsIndex[i].start <= this.core.selection.focusOffset - 1 &&
        wordsIndex[i].end >= this.core.selection.focusOffset - 1
      ) {
        // salvando a posicao do marcador
        this.currentIndex = {
          start: wordsIndex[i].start,
          end: wordsIndex[i].end
        };
        return true;
      }
    });

    if (!this.regexWord.test(this.current)) return;

    // pegar o marcador correto
    let marker = this._getMarker(this.current);

    // pesquisar lista
    const exp = new RegExp(this.current.slice(1).trim(), "i");
    this.currentList = marker.items
      .filter(i => exp.test(i.name) || exp.test(i.raw))
      .sort(a => {
        const test = (a.name + a.raw).match(exp);
        return test ? -test.length : 1;
      });

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
   * Executado quando um item da lista eh selecionado
   *
   * @param {Element} editor
   * @param {Object} item
   */
  selectedItem(editor, item) {
    // caso item nao tenha click
    if (!item.render) return;

    // adicionando o texto antes da hotkey
    if (this.currentIndex.start > 0) {
      let start = document.createTextNode(
        this.core.selection.focusNode.data.slice(0, this.currentIndex.start)
      );
      this.core.selection.focusNode.parentNode.insertBefore(
        start,
        this.core.selection.focusNode
      );
      document.execCommand("insertText", false, " ");
    }

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
      this.core.selection.focusNode.parentNode.insertBefore(
        customElement || element,
        this.core.selection.focusNode
      );

      document.execCommand("insertText", false, " ");

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

    // executando acao da hotkey
    item.render(this.core, createElement);
  }

  /**
   * Carrega os componentes do texto com as informacoes da lista
   *
   * TODO: rodar essa funcao quando ocorrer alteracao na lista
   */
  loadComponents() {
    this.core.editor.querySelectorAll(".hotkey").forEach(element => {
      if (!element.dataset.item) return;
      // pega o marcador
      let item = this._getMarker(element.dataset.item);
      if (!item || !item.items) return;
      // pega o item
      item = item.items.find(i => i.raw == element.dataset.item);
      if (!item) return;
      element.innerHTML = null;
      // executando acao da hotkey
      let result = item.render(this.core, () =>
        element.appendChild(document.createElement("span"))
      );
      if (!result) return;
      if (typeof result == "string") element.innerHTML = result;
    });
  }

  /**
   * Altera um lista de items de um marcador
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
