import { identifyAllElements } from "./identify-all-elements";

declare module window {
  export let hasRun: boolean;
}

(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  document.addEventListener("DOMContentLoaded", () => {
    // fast enough to run in 6ms!
    identifyAllElements(document.body);
  });

  document.addEventListener("mouseup", (event) => {
    const selection = document.getSelection();
    const selectedText = selection?.toString();
    if (selectedText && selectedText.trim().length > 0) {
      console.log(event.target, selectedText);
    }
  });
})();
