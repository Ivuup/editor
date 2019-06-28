import Plugin from "../../contracts/Plugin";
import Button from "../../contracts/Button";

export default class RemoveFormat extends Plugin {
  prefix = "removeFormat";

  buttons = [new Button("removeFormat", "removeFormat.remove", "format_clear")];

  remove() {
    document.execCommand("removeFormat", false, "");
  }
}
