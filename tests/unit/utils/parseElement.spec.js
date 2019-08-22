import parseElement from "@/utils/parseElement.js";

describe("ParseElement", () => {
  it("should be a function", () => {
    expect(typeof parseElement).toMatch("function");
  });

  it("should need two params", () => {
    expect(() => parseElement()).toThrow();
    expect(() => parseElement("asdasd")).toThrow();
  });

  it("params should an element or a string", () => {
    expect(() => parseElement([])).toThrow();
    expect(() => parseElement(123)).toThrow();
    expect(() => parseElement([], [])).toThrow();
    expect(() => parseElement(123, 123)).toThrow();
    expect(() =>
      parseElement("sasdasd", document.createElement("div"))
    ).toBeTruthy();
    expect(() =>
      parseElement(document.createElement("div"), "sasdasd")
    ).toBeTruthy();
  });

  it("should return a document element", () => {
    expect(parseElement("<div></div>", "<p></p>") instanceof HTMLElement).toBe(
      true
    );
  });

  it("should return same string that second param", () => {
    expect(parseElement(element1, element2).innerHTML.trim()).toMatch(
      element2.trim()
    );
    expect(parseElement(element3, element1).innerHTML.trim()).toMatch(
      element1.trim()
    );
  });

  it("should be same instance of fist param", () => {
    let el = document.createElement("div");
    el.innerHTML = element1;
    expect(parseElement(el, element2)).toBe(el);
  });

  it("child should be same instance of first child", () => {
    let el = document.createElement("div");
    el.innerHTML = element1;
    let h1 = el.children[0];
    expect(parseElement(el, element2).children[0]).toBe(h1);
  });
});

const element1 =
  "<h1>The title</h1>" +
  '<p class="abc" data-item="test">an text here</p>' +
  '<p>an another <a href="#">text</a> <span>here</span></p>' +
  "<p>an another <b>text</b> <span>here</span></p>";

const element2 =
  "<h1>The title</h1>" +
  "<p>an text inserted here</p>" +
  "<h1>The title</h1>" +
  '<p>an another <a href="#">text</a> <span>heres</span></p>' +
  "<p>and here</p>" +
  "<p>an another <b>text</b> <span>here</span></p>";

const element3 = `<p>only one paragraph</p>`;
