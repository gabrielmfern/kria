import { createEventListener } from "@solid-primitives/event-listener";
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  type Accessor,
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
      console.log(watcher.element);
      createEventListener(watcher.element, "mouseover", () => {
        console.log("mouse over");
        watcher.hover();
        hovered = watcher;
      });
      onCleanup(() => {
        console.log("cleanup effect of events");
      });
    }
  });

  createEventListener(document, "mousemove", (event) => {
    if (!hovered) return;

    const mousePoint = { x: event.pageX, y: event.pageY };
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
      console.log("cleanup watcher");
      setWatchers((watchers) => watchers.filter((w) => w !== watcher));
    });
  };
}
