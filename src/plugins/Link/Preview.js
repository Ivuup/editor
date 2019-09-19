import Plugin from "../../contracts/Plugin";

export default class Preview extends Plugin {
  prefix = "preview";
  regex = /^[https?://|(www.)]*(?:[-a-zA-Z0-9:%_+~#=]{2,256}|[.]+)\.[a-z]{2,6}\b(?:[-a-zA-Z0-9:%_+.~#?&//=]*)$/;
  apiUrl = "https://linkpreview-api.herokuapp.com/";
  response;
  currentWord;

  /**
   * Gera o elemento de preview
   *
   * @param {String} url
   * @param {Element} target
   */
  getLinkPreview(url) {
    if (!this.createAnchorLink(url)) return false;

    this._httpRequest(url, response => {
      response = JSON.parse(response);
      if (response.images.length <= 0) return;

      const maxWidth = this.core.config.preview.image.maxWidth || "unset";

      let preview = document.createElement("a");
      preview.className = "link-preview";
      preview.contentEditable = false;
      preview.href = url;
      preview.target = "_blank";
      preview.innerHTML = `
          <div class="wrap">
            <img src="${
              response.images[0]
            }" class="preview-image" width="${maxWidth}"/>
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
    });
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
        return;
      }
    };
    http.onerror = () => {
      error();
    };
    http.send(params);
  }

  createAnchorLink(url) {
    if (!(this.currentWord.node instanceof Node)) {
      url = /^http/.test(url) ? url : "https://" + url;
      document.execCommand("createLink", false, url);
      return true;
    }
    if (this.currentWord.node.parentNode.nodeName == "A") return false;
    // adicionando o texto antes da hotkey
    if (this.currentWord.start > 0) {
      let start = document.createTextNode(
        this.currentWord.node.data.slice(0, this.currentWord.start)
      );
      this.currentWord.node.parentNode.insertBefore(
        start,
        this.currentWord.node
      );
    }
    let a = document.createElement("a");
    a.href = /^http/.test(url || this.currentWord.word)
      ? url || this.currentWord.word
      : "https://" + url || this.currentWord.word;
    a.target = "_blank";
    a.innerText = url || this.currentWord.word;

    this.currentWord.node.parentNode.insertBefore(a, this.currentWord.node);

    this.currentWord.node.data = this.currentWord.node.data.slice(
      this.currentWord.end + 1
    );

    window.getSelection().setPosition(a.nextSibling, a.nextSibling.length);

    return true;
  }
}
