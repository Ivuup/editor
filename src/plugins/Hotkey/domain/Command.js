export class Command {
  name = undefined;
  params = [];
  _raw = undefined;
  raw_params = undefined;
  hotkey = undefined;

  constructor(raw) {
    if (raw) this.fill(raw);
  }

  fill(raw) {
    this._raw = raw;
    this.name = /[\w|\W]*?(?=\(|$)/.exec(raw)[0].slice(1);
    raw = raw.charAt(raw.length - 1) == ")" ? raw : raw + ")";
    this.hotkey = raw.charAt(0);
    this.raw_params = raw.slice(this.name.length + 2, -1);
    try {
      this.params = JSON.parse(`${this.raw_params}`);
    } catch (e) {
      this.params = this.raw_params.split(",");
      this.params =
        this.params.length > 0
          ? this.params.map(p => p.trim()).filter(p => !!p)
          : [];
    }
  }

  get raw() {
    return `${this.hotkey + this.name}(${JSON.stringify(this.params)})`;
  }

  set raw(raw) {
    this.fill(raw);
  }
}
