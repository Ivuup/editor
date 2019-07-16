import Plugin from "../../contracts/Plugin";
import Button from "../../contracts/Button";

export default class Upload extends Plugin {
  prefix = "upload";
  regex = /file:\/\/\/[\w|\W]*/;
  buttons = [
    new Button("uploadImage", "upload.new", "add_a_photo", "Inserir imagem")
  ];

  constructor(core) {
    super(core);

    this.core.editor.addEventListener("drop", this._onDrop.bind(this));
  }

  onPaste(event) {
    let items = event.clipboardData.items
      ? (items => {
          let tmp = [];
          for (let i = 0; i < items.length; i++) {
            if (items[i].kind === "file") tmp.push(items[i]);
          }
          return tmp;
        })(event.clipboardData.items)
      : event.clipboardData.files;

    if (items.length <= 0) return;

    event.preventDefault();
    this._insertImages(items);
  }

  _onDrop(event) {
    event.preventDefault();

    let items = event.dataTransfer.items
      ? (items => {
          let tmp = [];
          for (let i = 0; i < items.length; i++) {
            if (items[i].kind === "file") tmp.push(items[i]);
          }
          return tmp;
        })(event.dataTransfer.items)
      : event.dataTransfer.files;

    if (items.length <= 0) return;

    this._insertImages(items);
  }

  _insertImages(files) {
    // lendo arquivos
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onloadend = function() {
        const width = this.core.config.upload.width || 'unset'
        const asLink = this.core.config.upload.asLink
        const html = asLink 
            ? `<a href="${reader.result}" download="${files[0].name}"><img src="${reader.result}" width="${width}" /></a>`
            : `<img src="${reader.result}" width="${width}" />`
        document.execCommand("insertHTML", false, html);
      };
      reader.readAsDataURL(
        files[i].getAsFile ? files[i].getAsFile() : files[i]
      );
    }
  }

  new() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.addEventListener(
      "change",
      (event => {
        this._insertImages(event.target.files || event.path[0].files);
      }).bind(this)
    );
    input.click();
  }
}
