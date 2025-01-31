import { createEventListener } from "@solid-primitives/event-listener";
import { createKeyHold } from "@solid-primitives/keyboard";
import { Show, createSignal } from "solid-js";
import type { ComponentProps } from "solid-js";
import { cn } from "../utils/cn";

type HighlightingIndicatorProps = ComponentProps<"span">;

function HighlightingIndicator(props: HighlightingIndicatorProps) {
  return (
    <span
      {...props}
      class={cn(
        "kria-z-[99999] kria-rounded-full kria-w-[12px] kria-h-[12px]",
        "kria-ring-4 kria-ring-emerald-700/40 kria-bg-emerald-400 kria-animate-pulse aria-disabled:kria-animate-none",
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
          <span class="kria-bg-emerald-400 kria-border kria-border-solid kria-border-emerald-700 kria-rounded-[4px]" />
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
        class="kria-fixed kria-left-0 kria-top-0"
        style={{
          transform: `translate3D(${mousePosition().x + 10}px, ${mousePosition().y + 20}px, 0px)`,
        }}
      />
      <div
        class="
          kria-fixed kria-right-1/2 kria-translate-x-1/2 kria-bottom-[64px]
          kria-w-fit kria-h-fit kria-z-[99999] kria-bg-emerald-600
          kria-border kria-border-solid kria-border-emerald-700 kria-text-white
          kria-flex kria-items-center kria-align-middle kria-justify-center
          kria-rounded-[8px] kria-gap-[6px] kria-text-[12px] kria-leading-[1.33333] kria-tracking-[0] kria-px-[12px] kria-py-[8px]
          kria-select-none kria-font-sans
        "
      >
        <HighlightingIndicator aria-disabled /> Highlighting active{" "}
        <code
          class="kria-bg-emerald-700 kria-px-2 kria-py-1 kria-m-0 kria-rounded-[4px]"
          style={{ background: "#303030" }}
        >
          alt
        </code>
      </div>
    </Show>
  );
}
