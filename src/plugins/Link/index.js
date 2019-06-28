import Plugin from "../../contracts/Plugin";
import Button from "../../contracts/Button";

export default class Link extends Plugin {
  prefix = "link";
  buttons = [new Button("link", "link.create", "link", "Inserir link")];

  create(url) {
    if (typeof url != "string") url = prompt("Digite a URL");

    if (!url) return;

    if (!/^http/.test(url)) url = "https://" + url;

    let previewPlugin = this.core.plugins["preview"];
    if (previewPlugin)
      previewPlugin.getLinkPreview(url, this.core.selection.focusNode);
    else document.execCommand("createLink", false, url);
  }
}
