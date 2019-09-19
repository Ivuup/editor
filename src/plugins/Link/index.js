import Plugin from "../../contracts/Plugin";
import Button from "../../contracts/Button";

export default class Link extends Plugin {
  prefix = "link";
  buttons = [new Button("link", "link.create", "link", "Inserir link")];
  regex = /^[https?://|(www.)]*(?:[-a-zA-Z0-9:%_+~#=]{2,256}|[.]+)\.[a-z]{2,6}\b(?:[-a-zA-Z0-9:%_+.~#?&//=]*)$/;

  /**
   * Verifica se o que foi colado é uma url
   *
   * @param {ClipboardEvent} event
   */
  onPaste(event) {
    let text = event.clipboardData.getData("TEXT");

    if (this.regex.test(text)) {
      this.currentWord.node = undefined;
      this.create(this.regex.exec(text)[0]);
    }
  }

  /**
   * Verifica o conteúdo sendo adicionando e se é uma url
   *
   * @param {InputEvent} event
   */
  onKeyup(event) {
    if (event.code != "Enter" && event.code != "Space") {
      this.currentWord = this.core._helpers.currentWord;
      return;
    }

    if (
      this.currentWord.node &&
      this.currentWord.node.parentElement.nodeName == "A"
    )
      return;

    let result = this.regex.exec(this.currentWord.word);
    if (!result) return;

    try {
      this.create(result[0]);
      this.currentWord.selection.setPosition(
        this.currentWord.selection.focusNode,
        this.currentWord.selection.focusOffset
      );
      document.execCommand("insertText", false, " ");
      this.currentWord.node.deleteData(
        this.currentWord.start,
        this.currentWord.end + 2
      );
      this.currentWord = {};
    } catch (e) {
      this.currentWord = {};
    }
  }

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
