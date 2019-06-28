import Plugin from "../../../contracts/Plugin";
import Button from "../../../contracts/Button";

export default class Underline extends Plugin {
  prefix = "underline";
  buttons = [
    new Button(
      "underline",
      "underline.toggle",
      "format_underlined",
      "Sublinhado"
    )
  ];

  toggle() {
    document.execCommand("underline", false, "");
  }
}
