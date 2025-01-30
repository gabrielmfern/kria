import { createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { createMutationObserver } from "@solid-primitives/mutation-observer";
import {
  getBibleTextReferences,
  type TextReference,
} from "../utils/get-bible-text-references";

interface Text {
  node: Node;
  reference: TextReference;
}

function findTexts(node: Node) {
  let texts: Text[] = [];
  if (!node.hasChildNodes() && node.textContent) {
    for (const reference of getBibleTextReferences(node.textContent)) {
      texts.push({
        node,
        reference,
      });
    }
  }

  for (const child of Array.from(node.childNodes)) {
    texts = texts.concat(findTexts(child));
  }

  return texts;
}

export function BibleReferences() {
  const [texts, setTexts] = createStore<Text[]>([]);

  onMount(() => {
    console.time('finding texts');
    setTexts(findTexts(document.body));
    console.timeEnd('finding texts');
  });

  createEffect(() => {
    texts.length;
    console.dir(texts);
  });

  createMutationObserver(
    document.body,
    {
      childList: true,
      subtree: true,
    },
    (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          // console.dir(mutation);
          // batch(() => {
          //   for (const node of Array.from(mutation.addedNodes)) {
          //     setTexts(
          //       produce((texts) => {
          //         texts.push(...findTexts(node));
          //       }),
          //     );
          //   }
          //   for (const node of Array.from(mutation.removedNodes)) {
          //     setTexts((texts) => texts.filter((text) => text.node !== node));
          //   }
          // });
        }
      }
    },
  );

  return <></>;
}
