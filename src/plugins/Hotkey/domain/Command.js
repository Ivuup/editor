export class Command {
  name = undefined;
  params = [];
  raw = undefined;
  raw_params = undefined;
  hotkey = undefined;

  constructor(raw) {
    if (raw) this.fill(raw);
  }

  fill(raw) {
    this.raw = raw;
    this.name = /[\w|\W]*?(?=\(|$)/.exec(raw)[0].slice(1);
    raw = raw.charAt(raw.length - 1) == ")" ? raw : raw + ")";
    this.hotkey = raw.charAt(0);
    this.raw_params = raw.slice(this.name.length + 2, -1);
    this.params = this.raw_params.split(",");
    this.params =
      this.params.length > 0
        ? this.params.map(p => p.trim()).filter(p => !!p)
        : [];
  }
}
