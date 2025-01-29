import { render } from "solid-js/web";
import { Extension } from "./extension";

function getSolidRoot() {
  let koreShadowDiv = document.getElementById("kore-shadow");
  if (!koreShadowDiv) {
    koreShadowDiv = document.createElement("div");
    koreShadowDiv.id = "kore-shadow";
    document.body.appendChild(koreShadowDiv);
  }

  let koreShadow = koreShadowDiv.shadowRoot;
  if (!koreShadow) {
    koreShadow = koreShadowDiv.attachShadow({ mode: "open" });

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = browser.runtime.getURL("/dist/index.css");
    koreShadow.appendChild(styleLink);
  }

  koreShadow.getElementById("kore-solid-root")?.remove();

  const solidRoot = document.createElement("div");
  solidRoot.id = "kore-solid-root";
  koreShadow.appendChild(solidRoot);

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
