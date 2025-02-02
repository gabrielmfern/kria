import { createEventListener } from "@solid-primitives/event-listener";
import {
  type Ref,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { isPointInside } from "../../primitives/create-safe-hover-event";
import type { Text } from "../bible-references";

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
    setMousePosition({ x: event.clientX, y: event.clientY });
  });

  const hoveringText = () => {
    return isPointInside(mousePosition(), range().getBoundingClientRect(), 15);
  };

  return (
    <span
      ref={props.ref}
      aria-label="show content for reference"
      data-visible={props.visible || hoveringText()}
      style={style()}
      class="
        opacity-0 data-[visible=true]:opacity-100 transition-opacity
        fixed -translate-y-1/2 z-[99999]
        bg-slate-800 text-slate-300 border border-solid border-slate-600
        rounded-full p-0.5 flex justify-center items-center
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
