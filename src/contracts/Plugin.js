import Core from "../core";

export default class Plugin {
  core;

  constructor(core) {
    if (!(core instanceof Core))
      throw new Error("Variable is not an instance of Core");

    this.core = core;
  }

  exec(command, options) {
    return this[command](options);
  }
}
