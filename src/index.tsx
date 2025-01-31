import { render } from "solid-js/web";
import { Extension } from "./extension";

function getSolidRoot() {
  let kriaShadowDiv = document.getElementById("kria-shadow");
  if (!kriaShadowDiv) {
    kriaShadowDiv = document.createElement("div");
    kriaShadowDiv.id = "kria-shadow";
    document.body.appendChild(kriaShadowDiv);
  }

  let kriaShadow = kriaShadowDiv.shadowRoot;
  if (!kriaShadow) {
    kriaShadow = kriaShadowDiv.attachShadow({ mode: "open" });

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = chrome.runtime.getURL("/dist/index.css");
    kriaShadow.appendChild(styleLink);
  }

  kriaShadow.getElementById("kria-solid-root")?.remove();

  const solidRoot = document.createElement("div");
  solidRoot.id = "kria-solid-root";
  kriaShadow.appendChild(solidRoot);

  return solidRoot;
}

if (!document.body) {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      render(() => <Extension />, getSolidRoot());
    });
  });
} else {
  // this means that the extension is probably reloading
  render(() => <Extension />, getSolidRoot());
}
