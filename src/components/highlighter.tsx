import { createEventListener } from "@solid-primitives/event-listener";
import { createKeyHold } from "@solid-primitives/keyboard";
import { createSignal, Show } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "../utils/cn";

type HighlightingIndicatorProps = ComponentProps<"span">;

function HighlightingIndicator(props: HighlightingIndicatorProps) {
  return (
    <span
      {...props}
      class={cn(
        "z-[99999] rounded-full w-[12px] h-[12px]",
        "ring-4 ring-emerald-700/40 bg-emerald-400 animate-pulse aria-disabled:animate-none",
        props.class,
      )}
    />
  );
}

interface Highlight {
  range: Range;
  highlighter: HTMLSpanElement;
}


export function Highlighter() {
  const isHoldingAlt = createKeyHold("Alt");

  const highlights = new Set<Highlight>();

  createEventListener(document, "mouseup", (event) => {
    const selection = document.getSelection();
    if (event.altKey && selection) {
      const selectedText = selection.toString();
      if (selectedText && selectedText.trim().length > 0) {
        const range = selection.getRangeAt(0);

        for (const { highlighter } of highlights) {
          if (range.intersectsNode(highlighter)) return;
        }

        const highlightSpan = (
          <span
            style={{
              "background-color": "rgb(52 211 153 / 0.6)",
              border: "1px solid rgb(4 120 87)",
              "border-radius": "4px",
            }}
          />
        ) as HTMLSpanElement;
        highlights.add({
          range,
          highlighter: highlightSpan,
        });
        range.surroundContents(highlightSpan);
      }
    }
  });

  const [mousePosition, setMousePosition] = createSignal<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  createEventListener(document, "mousemove", (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  });

  return (
    <Show when={isHoldingAlt()}>
      <HighlightingIndicator
        class="fixed left-0 top-0"
        style={{
          transform: `translate3D(${mousePosition().x + 10}px, ${mousePosition().y + 20}px, 0px)`,
        }}
      />
      <div
        class="
          fixed right-1/2 translate-x-1/2 bottom-[64px]
          w-fit h-fit z-[99999] bg-emerald-600
          border border-solid border-emerald-700 text-white
          flex items-center align-middle justify-center
          rounded-[8px] gap-[6px] text-[12px] leading-[1.33333] tracking-[0] px-[12px] py-[8px]
          select-none font-sans
        "
      >
        <HighlightingIndicator aria-disabled /> Highlighting active{" "}
        <code
          class="bg-emerald-700 px-2 py-1 m-0 rounded-[4px]"
          style={{ background: "#303030" }}
        >
          alt
        </code>
      </div>
    </Show>
  );
}
