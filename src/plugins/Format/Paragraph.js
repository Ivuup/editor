import Plugin from "../../contracts/Plugin";

export default class Paragraph extends Plugin {
  prefix = "paragraph";

  constructor(core) {
    super(core);
    document.execCommand("defaultParagraphSeparator", false, "p");
  }
}
