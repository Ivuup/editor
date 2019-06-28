import Plugin from "../../../contracts/Plugin";
import Button from "../../../contracts/Button";

export default class Bold extends Plugin {
  prefix = "bold";
  buttons = [new Button("bold", "bold.toggle", "format_bold", "Negríto")];

  onKeydown() {
    //TODO: Melhorar verificacao
    this.buttons[0].active =
      this.core.selection.focusNode.parentNode.nodeName == "B";
  }

  toggle() {
    document.execCommand("bold", false, "");
  }
}
