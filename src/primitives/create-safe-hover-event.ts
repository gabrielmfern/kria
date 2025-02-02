import { createEventListener } from "@solid-primitives/event-listener";
import {
  type Accessor,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";

export function isPointInside(
  point: { x: number; y: number },
  domRect: DOMRect,

  offset: number,
) {
  return (
    domRect.x - offset <= point.x &&
    domRect.y - offset <= point.y &&
    domRect.x + domRect.width + offset >= point.x &&
    domRect.y + domRect.height + offset >= point.y
  );
}

interface Options {
  safezoneElements: Accessor<(Element | undefined)[]>;
  safetyOffset: number;
}

interface Watcher {
  element: Element;
  hover(): void;
  leave(): void;
}

export function createSafeHover(options: Options) {
  const [watchers, setWatchers] = createSignal<Watcher[]>([]);

  let hovered: Watcher | undefined = undefined;
  createEffect(() => {
    for (const watcher of watchers()) {
      createEventListener(watcher.element, "mouseover", () => {
        watcher.hover();
        hovered = watcher;
      });
    }
  });

  createEventListener(document, "mousemove", (event) => {
    if (!hovered) return;

    const mousePoint = { x: event.clientX, y: event.clientY };
    const safezones = options.safezoneElements().filter(Boolean) as Element[];

    if (
      !isPointInside(mousePoint, hovered.element.getBoundingClientRect(), 0) &&
      safezones.every(
        (safezone) =>
          !isPointInside(
            mousePoint,
            safezone.getBoundingClientRect(),
            options.safetyOffset,
          ),
      )
    ) {
      hovered.leave();
      hovered = undefined;
    }
  });

  return function watch(watcher: Watcher) {
    onMount(() => {
      setWatchers((watchers) => [...watchers, watcher]);
    });

    onCleanup(() => {
      setWatchers((watchers) => watchers.filter((w) => w !== watcher));
    });
  };
}
