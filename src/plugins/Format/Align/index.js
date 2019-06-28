import Plugin from "../../../contracts/Plugin";
import Button from "../../../contracts/Button";

let left = new Button("align-left", "align.left", "format_align_left");
let right = new Button("align-right", "align.right", "format_align_right");
let center = new Button("align-center", "align.center", "format_align_center");
let justify = new Button(
  "align-justify",
  "align.justify",
  "format_align_justify"
);
let alignment = new Button(
  "alignment",
  [left, center, right, justify],
  "format_align_justify"
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
