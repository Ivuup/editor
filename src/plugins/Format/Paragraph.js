import Plugin from '@/contracts/Plugin'

export default class Paragraph extends Plugin {
  constructor(core) {
    super(core)
    document.execCommand("defaultParagraphSeparator", false, "p")
  }
}