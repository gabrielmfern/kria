import { render } from "solid-js/web";
import { Extension } from "./extension";

declare global {
  export interface Window {
    koreHasAttached: boolean;
  }
}

function getSolidRoot() {
  let solidRoot = document.getElementById("kore-solid-root");
  if (solidRoot) return solidRoot;

  solidRoot = document.createElement("div");
  solidRoot.id = "kore-solid-root";
  solidRoot.setAttribute("data-kore-ignore", "");
  document.body.appendChild(solidRoot);

  return solidRoot;
}

if (!window.koreHasAttached) {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      window.koreHasAttached = true;

      render(() => <Extension />, getSolidRoot());
    });
  });
}
