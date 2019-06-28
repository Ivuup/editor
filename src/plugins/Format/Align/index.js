import Plugin from "../../../contracts/Plugin";
import Button from "../../../contracts/Button";

let left = new Button(
  "align-left",
  "align.left",
  "format_align_left",
  "Esquerda"
);
let right = new Button(
  "align-right",
  "align.right",
  "format_align_right",
  "Direita"
);
let center = new Button(
  "align-center",
  "align.center",
  "format_align_center",
  "Centralizado"
);
let justify = new Button(
  "align-justify",
  "align.justify",
  "format_align_justify",
  "Justificado"
);
let alignment = new Button(
  "alignment",
  [left, center, right, justify],
  "format_align_justify",
  "Alinhar"
);

export default class Align extends Plugin {
  prefix = "align";
  buttons = [left, right, center, justify, alignment];

  left() {
    document.execCommand("justifyLeft", false, "");
  }
  right() {
    document.execCommand("justifyRight", false, "");
  }
  center() {
    document.execCommand("justifyCenter", false, "");
  }
  justify() {
    document.execCommand("justifyFull", false, "");
  }
}
