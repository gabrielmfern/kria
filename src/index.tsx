import { render } from "solid-js/web";
import { Extension } from "./extension";

function getSolidRoot() {
  let solidRoot = document.getElementById("kore-solid-root");
  if (solidRoot) return solidRoot;

  solidRoot = document.createElement("div");
  solidRoot.id = "kore-solid-root";
  solidRoot.setAttribute("data-kore-ignore", "");
  document.body.appendChild(solidRoot);

  return solidRoot;
}

if (!document.body) {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      render(() => <Extension />, getSolidRoot());
    });
  });
} else {
  render(() => <Extension />, getSolidRoot());
}
