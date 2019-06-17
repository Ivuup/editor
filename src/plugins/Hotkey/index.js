import Plugin from '@/contracts/Plugin'

export default class Hotkey extends Plugin {
  // regexMarkers
  regex
  regexWord
  constructor(core) {
    super(core)
    let markers = `[${this.core.config.hotkey.map(m => m.marker).join('|')}]`
    // preparar regex de acordo com os marcadores
    // this.regexMarkers = new RegExp(markers)
    this.regex = new RegExp(`${markers}[\\w]*`)
    this.regexWord = new RegExp(`^${markers}[\\w]*`)
    // varrer o conteúdo e renderizar os componentes
  }

  onInput(event) {
    // verifica se existe um marcador
    if (!this.regex.test(this.core.selection.focusNode.data))
      return
      
    this.core.selection = null
    this.core.selection = window.getSelection()
    let words = this.core.selection.focusNode.data.split(' ')
    let count = 0
    let wordsIndex = words.map(w => {
      count+= w.length
      return count++
    })
    let current = words.find((w, i) => wordsIndex[i] >= this.core.selection.focusOffset)
    
    if (!this.regexWord.test(current))
      return

    // pegar o marcador correto
    let marker = this._getMarker(current)
    // renderizar lista e pesquisar
    // TODO: implementar
  }

  _getMarker(word) {
    return this.core.config.hotkey.find(m => m.marker == word.slice(0, 1))
  }
}