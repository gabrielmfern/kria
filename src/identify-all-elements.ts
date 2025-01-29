export function identifyAllElements(
  node: Node,
  rawPrefix?: string,
  watch = true,
) {
  const prefix = rawPrefix ? `${rawPrefix}-` : "";

  node.childNodes.forEach((childNode, key) => {
    if (childNode instanceof Element) {
      const id = `${prefix}${key}`;
      childNode.setAttribute("data-kore-id", id);
      identifyAllElements(childNode, id, false);
    }
  });

  if (watch) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-kore-id"
        ) {
          mutation.target;
        }
      }
    });

    observer.observe(node, {
      attributeFilter: ["data-kore-id"],
      subtree: true,
      attributes: true,
      childList: true,
    });
  }
}
