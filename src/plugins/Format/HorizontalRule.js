import Plugin from "../../contracts/Plugin";
import Button from "../../contracts/Button";

export default class HorizontalRule extends Plugin {
  prefix = "horizontalRule";
  buttons = [new Button("horizontalRule", "horizontalRule.remove", "remove")];

  remove() {
    document.execCommand("insertHorizontalRule", false, "");
  }
}
