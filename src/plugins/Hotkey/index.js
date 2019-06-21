import Plugin from "../../contracts/Plugin";
import View from "./ui";

// TODO: Implementar
export default class Hotkey extends Plugin {
  // regexMarkers
  regex;
  regexWord;
  constructor(core) {
    super(core);
    let markers = `[${this.core.config.hotkey.map(m => m.marker).join("|")}]`;
    // preparar regex de acordo com os marcadores
    // this.regexMarkers = new RegExp(markers)
    this.regex = new RegExp(`${markers}[\\w]*`);
    this.regexWord = new RegExp(`^${markers}[\\w]*`);
    // varrer o conteúdo e renderizar os componentes
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
    let current = words.find(
      (w, i) =>
        wordsIndex[i].start <= this.core.selection.focusOffset - 1 &&
        wordsIndex[i].end >= this.core.selection.focusOffset - 1
    );

    if (!this.regexWord.test(current)) return;

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

    console.log(event.key);
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.core._floatAction.value = false;
        break;
    }
  }
}
