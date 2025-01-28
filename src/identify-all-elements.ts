export function identifyAllElements(
  node: Node,
  prefix?: string,
  watch: boolean = true,
) {
  prefix = prefix ? `${prefix}-` : "";
  node.childNodes.forEach((childNode, key) => {
    if (childNode instanceof Element) {
      const id = `${prefix}${key}`;
      childNode.setAttribute("data-kore-id", id);
      identifyAllElements(childNode, id, false);
    }
  });

  if (watch) {
    const observer = new MutationObserver((mutations) => { });

    observer.observe(node, {
      attributeFilter: ["data-kore-id"],
      attributes: true,
      childList: true,
    });
  }
}
