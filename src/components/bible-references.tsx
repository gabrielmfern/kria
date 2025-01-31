import { createMutationObserver } from "@solid-primitives/mutation-observer";
import { For, Show, createSignal, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { createSafeHover } from "../primitives/create-safe-hover-event";
import {
  type TextReference,
  getBibleTextReferences,
} from "../utils/get-bible-text-references";
import { Passage } from "./bible-references/passage";
import { ViewPassageHook } from "./bible-references/view-passage-hook";
import { Popover } from "./ui/popover";
import debounce from "debounce";

export interface Text {
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

  const updateTexts = debounce(() => {
    setTexts(reconcile(findTexts(document.body)));
  }, 100);

  onMount(() => {
    updateTexts();
  });

  createMutationObserver(
    document.body,
    {
      childList: true,
      subtree: true,
    },
    (mutations) => {
      if (mutations.some((mutation) => mutation.type === "childList")) {
        updateTexts();
      }
    },
  );

  const [hoveringState, setHoveringState] = createSignal<
    { text: Text; hook: HTMLSpanElement } | undefined
  >();

  const [popoverRef, setPopoverRef] = createSignal<HTMLDivElement>();

  const createHoverListener = createSafeHover({
    safezoneElements: () => [popoverRef()],
    safetyOffset: 10,
  });

  return (
    <>
      <For each={texts}>
        {(text) => (
          <ViewPassageHook
            visible={hoveringState()?.text === text}
            ref={(hook) => {
              createHoverListener({
                element: hook,
                hover() {
                  setHoveringState({
                    text,
                    hook,
                  });
                },
                leave() {
                  setHoveringState(undefined);
                },
              });
            }}
            text={text}
          />
        )}
      </For>
      <Show when={hoveringState()}>
        <Popover
          id="kria-bible-reference-popover"
          ref={setPopoverRef}
          onMouseDown={(event) => {
            event.stopImmediatePropagation();
          }}
          for={hoveringState()!.hook}
          position="bottom"
          class="flex-col bg-slate-800 w-60 text-slate-300 border border-solid border-slate-600"
        >
          <Passage
            book={hoveringState()!.text.reference.book}
            chapter={hoveringState()!.text.reference.chapter}
            verseRange={hoveringState()!.text.reference.verseRange}
          />
        </Popover>
      </Show>
    </>
  );
}
