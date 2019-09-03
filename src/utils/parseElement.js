export default (before, after) => parse(before, after);

const parse = (before, after) => {
  before = prepareElement(before);
  after = prepareElement(after || "<div></div>");

  if (after.nodeName == "#text") return change(before, after);

  // caso seja o mesmo conteúdo, retorne o elemento
  if (before.innerHTML == after.innerHTML) return before;

  // caso o tipo de elementos sejam diferentes
  if (before.nodeName !== after.nodeName) return change(before, after);

  // caso não tenha filhos
  if (!after.childNodes || after.childNodes.length <= 0)
    return change(before, after);

  let indexes = [];
  Array.from(after.childNodes).forEach((child, i) => {
    indexes.push(i);

    // caso não tenha o index, adicione o nó e continue
    if (!before.childNodes[i]) return before.appendChild(child);

    // caso seja nós diferentes, altere o nó e continue
    if (child.nodeName !== before.childNodes[i].nodeName)
      return change(before.childNodes[i], child);

    // caso contrário, verique o filho
    parse(before.childNodes[i], child.innerHTML);
  });

  // removendo index inexistentes
  Array.from(before.childNodes)
    .filter((child, i) => !indexes.includes(i))
    .forEach(child => {
      before.removeChild(child);
    });

  if (
    before.outerHTML.replace(before.innerHTML, "") !==
    after.outerHTML.replace(after.innerHTML, "")
  )
    before.outerHTML = after.outerHTML;

  return before;
};

const prepareElement = elementOrString => {
  if (!elementOrString) throw new Error("after not defined");

  if (typeof elementOrString == "string") {
    let e = document.createElement("div");
    e.innerHTML = elementOrString;
    elementOrString = e;
  }

  if (elementOrString instanceof HTMLElement || elementOrString instanceof Node)
    return elementOrString;

  throw new Error("should be an element or a string");
};

const change = (before, after) => {
  let parent = before.parentElement;
  let clone = after.cloneNode(true);

  parent.insertBefore(clone, before);
  parent.removeChild(before);

  return clone;
};
