class Result {
  word = undefined;
  start = undefined;
  end = undefined;
  node = undefined;

  constructor(selection) {
    this.selection = selection;
    this.node = selection ? selection.focusNode : undefined;
  }
}

export default () => {
  let result = new Result(window.getSelection());

  if (result.node.nodeName != "#text") return new Result();

  let words = result.node.data.split(" ");
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

  // pegando a palavra atual
  result.word = words.find((w, i) => {
    if (
      wordsIndex[i].start <= result.selection.focusOffset - 1 &&
      wordsIndex[i].end >= result.selection.focusOffset - 1
    ) {
      // salvando a posicao do marcador
      result.start = wordsIndex[i].start;
      result.end = wordsIndex[i].end;
      return true;
    }
  });

  return result;
};
