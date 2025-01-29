export function identifyAllElements(
  node: Node,
  rawPrefix?: string | null,
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
          console.warn(
            "The data-kore-id has been changed, this is unexpected",
            {
              hostname: location.hostname,
            },
          );
          return;
        }

        if (
          mutation.type === "childList" &&
          mutation.target instanceof Element
        ) {
          identifyAllElements(
            mutation.target,
            mutation.target.getAttribute("data-kore-id"),
            false,
          );
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
