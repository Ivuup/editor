import Plugin from "../../../contracts/Plugin";
import Button from "../../../contracts/Button";

export default class Underline extends Plugin {
  buttons = [new Button("underline", "underline.toggle", "format_underlined")];

  toggle() {
    document.execCommand("underline", false, "");
  }
}
