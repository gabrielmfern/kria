import { identifyAllElements } from "./identify-all-elements";
import { createEventListener } from "@solid-primitives/event-listener";
import { createKeyHold } from "@solid-primitives/keyboard";
import { onMount, createSignal, Show, onCleanup } from "solid-js";
import type { ComponentProps } from "solid-js/types/server/rendering.js";
import "./extension.css";
import { cn } from "./cn";

type HighlightingIndicatorProps = ComponentProps<"span">;

function HighlightingIndicator(props: HighlightingIndicatorProps) {
  return (
    <span
      {...props}
      class={cn(
        "kore:z-auto kore:rounded-full kore:w-[12px] kore:h-[12px]",
        "kore:ring-4 kore:ring-emerald-700/40 kore:bg-emerald-400 kore:animate-pulse kore:aria-disabled:animate-none",
        props.class,
      )}
    />
  );
}

export function Extension() {
  onMount(() => {
    // fast enough to run in 6ms!
    const observer = identifyAllElements(document.body)!;

    onCleanup(() => {
      observer.disconnect();
    });
  });

  const isHoldingAlt = createKeyHold("Alt");

  createEventListener(document, "mouseup", (event) => {
    if (event.altKey) {
      const selection = document.getSelection();
      const selectedText = selection?.toString();
      if (selectedText && selectedText.trim().length > 0) {
        console.log(event.target, selectedText);
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
        class="kore:fixed kore:left-0 kore:top-0"
        style={{
          transform: `translate3D(${mousePosition().x + 10}px, ${mousePosition().y + 20}px, 0px)`,
        }}
      />
      <div
        class="
          kore:fixed kore:right-1/2 kore:-translate-x-1/2 kore:bottom-[64px]
          kore:w-fit kore:h-fit kore:z-auto kore:bg-emerald-600
          kore:border kore:border-solid kore:border-emerald-700 
          kore:flex kore:items-center kore:align-middle kore:justify-center
          kore:rounded-[8px] kore:gap-[6px] kore:text-[12px] kore:px-[12px] kore:py-[8px]
          kore:select-none kore:!font-sans
        "
      >
        <HighlightingIndicator aria-disabled /> Highlighting active{" "}
        <code
          class="kore:!bg-emerald-700 kore:!px-2 kore:!py-1 kore:!m-0 kore:!rounded-[4px]"
          style={{ background: "#303030" }}
        >
          alt
        </code>
      </div>
    </Show>
  );
}
