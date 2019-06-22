import Plugin from "../../contracts/Plugin";
import View from "./ui";

// TODO: Implementar
export default class Hotkey extends Plugin {
  // regexMarkers
  regex;
  regexWord;
  current;
  target;

  constructor(core) {
    super(core);
    let markers = `[${this.core.config.hotkey.map(m => m.marker).join("|")}]`;
    // preparar regex de acordo com os marcadores
    // this.regexMarkers = new RegExp(markers)
    this.regex = new RegExp(`${markers}[\\w]*`);
    this.regexWord = new RegExp(`^${markers}[\\w]*`);
    // varrer o conteúdo e renderizar os componentes
  }

  onKeydown(event) {
    this._checkActions(event);
  }

  onKeyup() {
    this.core._floatAction.value = false;
    // verifica se existe um marcador
    if (!this.regex.test(this.core.selection.focusNode.data)) return;

    this.core.selection = null;
    this.core.selection = window.getSelection();
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
    this.current = words.find(
      (w, i) =>
        wordsIndex[i].start <= this.core.selection.focusOffset - 1 &&
        wordsIndex[i].end >= this.core.selection.focusOffset - 1
    );

    // pegando o campo alvo
    this.target = this.core.selection.focusNode.parentNode;

    if (!this.regexWord.test(this.current)) return;

    // pegar o marcador correto
    // let marker = this._getMarker(current);
    // pesquisar lista
    // renderizar lista
    this.core._floatAction.component = View;
    this.core._floatAction.value = true;
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

  selectedItem(editor, item) {
    // caso item nao tenha click
    if (!item.clickHandle) return;

    this.target.innerHTML = this.target.innerHTML.replace(
      this.current,
      '<span id="hotkey-tmp"></span>&nbsp;'
    );
    let element = this.target.querySelector("#hotkey-tmp");
    element.removeAttribute("id");
    element.className = `hotkey ${item.class || ""}`;
    element.contentEditable = false;
    element.dataset.item = item.raw;

    let result = item.clickHandle(editor, element);

    window
      .getSelection()
      .setPosition(element.nextSibling, element.nextSibling.length);
    if (!result) return;
    if (typeof result == "string") element.innerHTML = result;
  }
}
