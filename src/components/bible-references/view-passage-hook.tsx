import {
  createMemo,
  createSignal,
  onMount,
  onCleanup,
  type Ref,
} from "solid-js";
import type { Text } from "../bible-references";
import type { JSX } from "solid-js/jsx-runtime";
import { createEventListener } from "@solid-primitives/event-listener";
import { isPointInside } from "../../primitives/create-safe-hover-event";

interface ViewPassageHookProps {
  text: Text;
  visible?: boolean;
  ref: Ref<HTMLSpanElement>;
}

const frameCallbacks: (() => void)[] = [];
setInterval(() => {
  for (const callback of frameCallbacks) {
    callback();
  }
}, 10);

export function ViewPassageHook(props: ViewPassageHookProps) {
  const range = createMemo(() => {
    const rng = new Range();
    rng.setStart(props.text.node, props.text.reference.index);
    rng.setEnd(
      props.text.node,
      props.text.reference.index + props.text.reference.raw.length,
    );
    return rng;
  });

  const [style, setStyle] = createSignal<JSX.CSSProperties>({});
  const computeStyles = () => {
    const bounds = range().getBoundingClientRect();
    setStyle({
      left: bounds.x + bounds.width + "px",
      top: bounds.y + "px",
    });
  };
  onMount(() => {
    frameCallbacks.push(computeStyles);
    onCleanup(() => {
      frameCallbacks.splice(frameCallbacks.indexOf(computeStyles), 1);
    });
  });

  const [mousePosition, setMousePosition] = createSignal({
    x: Number.NEGATIVE_INFINITY,
    y: Number.NEGATIVE_INFINITY,
  });
  createEventListener(document, "mousemove", (event) => {
    setMousePosition({ x: event.pageX, y: event.pageY });
  });

  const hoveringText = () =>
    isPointInside(mousePosition(), range().getBoundingClientRect(), 0);

  return (
    <span
      ref={props.ref}
      aria-label="show content for reference"
      data-visible={props.visible || hoveringText()}
      style={style()}
      class="
        kria-opacity-0 data-[visible=true]:kria-opacity-100 kria-transition-opacity
        kria-fixed -kria-translate-y-1/2 kria-z-[99999]
        kria-bg-slate-800 kria-text-slate-300 kria-border kria-border-solid kria-border-slate-600
        kria-rounded-md kria-p-0.5 kria-flex kria-justify-center kria-items-center
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <title>info</title>
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 19.5v-10h-.5m0 10h1m-.5-14V5"
        />
      </svg>
    </span>
  );
}
