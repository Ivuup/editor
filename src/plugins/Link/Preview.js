import Plugin from "../../contracts/Plugin";

export default class Preview extends Plugin {
  prefix = "preview";
  regex = /^[https?://|(www.)]*[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
  apiUrl = "https://linkpreview-api.herokuapp.com/";
  response;
  currentWord;

  /**
   * Verifica se o que foi colado é uma url
   *
   * @param {ClipboardEvent} event
   */
  onPaste(event) {
    let text = event.clipboardData.getData("TEXT");

    if (
      this.core.config &&
      this.core.config.preview &&
      this.core.config.preview.onPaste &&
      this.core.config.preview.onPaste instanceof Array &&
      this.core.config.preview.onPaste.some(func =>
        func(event, text, this.core.editor)
      )
    )
      return;
    else if (this.regex.test(text)) {
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
  onKeyup(event) {
    if (event.code != "Enter" && event.code != "Space") {
      this.currentWord = this.core._helpers.currentWord;
      return;
    }
    let result = this.regex.exec(this.currentWord.word);
    if (!result) return;

    // this.createAnchorLink(result);
    this.getLinkPreview(result[0]);
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
        if (response.images.length <= 0) return;

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
    url = /^http/.test(url) ? url : "https://" + url;
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

  createAnchorLink(match) {
    // adicionando o texto antes da hotkey
    if (match.index > 0) {
      let start = document.createTextNode(
        this.currentWord.node.data.slice(0, match.index)
      );
      this.currentWord.node.parentNode.insertBefore(
        start,
        this.currentWord.node
      );
    }
    let a = document.createElement("a");
    a.href = match[0];
    a.target = "_blank";
    a.innerText = match[0];

    this.currentWord.node.parentNode.insertBefore(a, this.currentWord.node);

    this.currentWord.node.data = this.currentWord.node.data.slice(
      match.index + match[0].length
    );

    document.execCommand("insertText", false, " ");
  }
}
