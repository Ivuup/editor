import Plugin from "../../../contracts/Plugin";
import Button from "../../../contracts/Button";

export default class Italic extends Plugin {
  prefix = "italic";
  buttons = [new Button("italic", "italic.toggle", "format_italic")];

  onKeydown() {
    //TODO: Melhorar verificacao
    this.buttons[0].active =
      this.core.selection.focusNode.parentNode.nodeName == "I";
  }

  toggle() {
    document.execCommand("italic", false, "");
  }
}
