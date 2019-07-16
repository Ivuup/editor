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
  }

  addState(data) {
    if (data == this.state[this.index]) return;

    this.state.push(data);
    this.index = this.state.length - 1;

    if (this.state.length > this.maxLength) this.state.shift();
  }

  onKeydown(event) {
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

    this.core.setContent(this.state[this.index]);
  }

  _redo(event) {
    event.preventDefault();

    if (
      this.index >= this.state.length - 1 ||
      this.state[++this.index] == undefined
    )
      return;

    this.core.setContent(this.state[this.index]);
  }
}
