import { render } from "solid-js/web";
import { Extension } from "./extension";

declare namespace window {
  export let hasRun: boolean;
}

(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  document.addEventListener("DOMContentLoaded", () => {
    const solidRoot = document.createElement("div");
    solidRoot.setAttribute("data-kore-ignore", "");
    document.body.appendChild(solidRoot);

    render(() => <Extension />, solidRoot);
  });
})();
