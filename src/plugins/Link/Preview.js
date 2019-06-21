import Plugin from "../../contracts/Plugin";

export default class Preview extends Plugin {
  regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
  apiUrl = "https://linkpreview-api.herokuapp.com/";
  response;
  lastText = "";
  lastNode;

  /**
   * Verifica se o que foi colado é uma url
   *
   * @param {ClipboardEvent} event
   */
  onPaste(event) {
    let text = event.clipboardData.getData("TEXT");
    if (this.regex.test(text)) {
      event.preventDefault();
      this.getLinkPreview(
        this.regex.exec(text)[0],
        this.core.selection.focusNode
      );
    }
  }

  /**
   * Verifica o conteúdo sendo adicionando e se é uma url
   *
   * @param {InputEvent} event
   */
  onInput(event) {
    if (event.inputType != "insertText") return;

    if (event.data && event.data != " ") {
      this.lastNode = this.core.selection.focusNode;
      this.lastNode =
        this.lastNode.parentNode == this.core.editor
          ? this.lastNode
          : this.lastNode.parentNode;
      this.lastText =
        this.core.selection.focusNode.innerText ||
        this.core.selection.focusNode.textContent;
      return;
    }
    if (
      !this.regex.test(this.lastText) ||
      (this.lastNode.previousSibling &&
        this.lastNode.previousSibling.className == "link-preview")
    ) {
      this.lastNode = null;
      this.lastText = null;
      return;
    }
    this.getLinkPreview(this.regex.exec(this.lastText)[0]);
  }

  /**
   * Gera o elemento de preview
   *
   * @param {String} url
   * @param {Element} target
   */
  getLinkPreview(url) {
    this._httpRequest(
      url,
      response => {
        response = JSON.parse(response);
        let preview = document.createElement("a");
        preview.className = "link-preview";
        preview.contentEditable = false;
        preview.href = response.url;
        preview.target = "_blank";
        preview.innerHTML = `
        <div class="wrap">
          <img src="${response.images[0]}" class="preview-image" />
          <div>
            <h3 class="preview-title">${response.title}</h3>
            <span class="preview-description">${response.description}</span>
          </div>
        </div>
      `;
        document.execCommand("createLink", false, url);
        document.execCommand(
          "insertHTML",
          false,
          `<div>${preview.outerHTML}</div>`
        );
      },
      () => {
        document.execCommand("createLink", false, url);
      }
    );
    this.lastText = null;
  }

  /**
   * Faz a requisição na api
   *
   * @param {String} url
   * @param {Function} success
   * @param {Function} error
   */
  _httpRequest(url, success, error) {
    const http = new XMLHttpRequest();
    const params = "url=" + url;
    http.open("POST", this.apiUrl, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200) {
        success(http.responseText);
      }
      if (http.readyState === 4 && http.status === 500) {
        error();
      }
    };
    http.send(params);
  }
}
