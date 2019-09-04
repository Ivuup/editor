import Plugin from "../contracts/Plugin";

export default class History extends Plugin {
  prefix = "history";
  state = [];
  maxLength = 150;
  index = 0;

  constructor(core) {
    super(core);
    core.editor.addEventListener("input", () => {
      this.addState(core.editor.innerHTML);
    });
    core.editor.addEventListener("keydown", event => {
      this.change(event);
    });
  }

  addState(data) {
    if (data == this.state[this.index]) return;

    this.state.push({
      data,
      node: window.getSelection().focusNode.parentElement,
      offset: window.getSelection().focusOffset
    });
    this.index = this.state.length;

    if (this.state.length > this.maxLength) this.state.shift();
  }

  change(event) {
    if (!event.ctrlKey) return;

    if (event.code == "KeyZ" && !event.shiftKey) this._undo(event);
    else if (
      (event.code == "KeyZ" && event.shiftKey) ||
      (event.code == "KeyY" && !event.shiftKey)
    )
      this._redo(event);
  }

  _undo(event) {
    event.preventDefault();

    if (this.index <= 0 || this.state[--this.index] == undefined) return;

    this._change();
  }

  _redo(event) {
    event.preventDefault();

    if (
      this.index >= this.state.length ||
      this.state[++this.index] == undefined
    )
      return;

    this._change();
  }

  _change() {
    this.core.setContent(this.state[this.index].data);

    window
      .getSelection()
      .collapse(
        ...this._test(
          this.state[this.index].node,
          this.state[this.index].offset
        )
      );
  }

  _test(element, offset) {
    if (typeof offset !== "object") offset = { value: offset };

    // is a node
    if (!(element instanceof Element)) {
      if (offset.value > element.length) offset.value -= element.length;

      return [element, offset.value];
    }

    for (let [index, child] of element.childNodes.entries()) {
      child = this._test(child, offset);
      if (offset <= 0 || index == element.childNodes.length - 1) return child;
    }
  }
}
