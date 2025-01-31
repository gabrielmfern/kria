import { type ComponentProps, createSignal, splitProps } from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import { mergeRefs } from "@solid-primitives/refs";
import { useFloating } from "solid-floating-ui";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import type { LeftIntersection } from "../../types/left-intersection";
import { cn } from "../../utils/cn";

export type PopoverPosition = Exclude<PopoverProps["position"], undefined>;
export type PopoverAlignment = Exclude<PopoverProps["align"], undefined>;

export type PopoverProps = LeftIntersection<
  {
    /**
     * @description The element the Dropdown will be anchored to.
     *
     * This element is necessary to know where the dropdown will be positioned and
     * sized according to.
     *
     * @example
     *
     * ```jsx
     * const [anchorRef, setAnchorRef] = createSignal(null);
     *
     * <MyElement ref={setAnchorRef} />
     *
     * <Popover for={anchorRef()}>
     *   This is an amazing pop over
     * </Popover>
     * ```
     */
    for: HTMLElement;

    /**
     * @default 'center'
     */
    align?: "start" | "center" | "end";

    /**
     * @default 'bottom'
     */
    position?: "top" | "left" | "right" | "bottom";
  },
  ComponentProps<"div">
>;

/**
 * A component that is very primitive in what it does. Provides you with just an element
 * that will do its best to position itself inside the screen while anchoring into the `for` prop.
 *
 * @param for The element the Dropdown will be anchored to.
 *
 * @example
 *
 * ```jsx
 * const [anchorRef, setAnchorRef] = createSignal(null);
 *
 * <MyElement ref={setAnchorRef} />
 *
 * <Popover for={anchorRef()}>
 *   Super gamer popover
 * </Popover>
 * ```
 */
export function Popover(allProps: PopoverProps) {
  const [props, elProps] = splitProps(allProps, ["for", "align", "position"]);

  const [popoverRef, setPopoverRef] = createSignal<HTMLDivElement>();

  const position = useFloating(() => props.for, popoverRef, {
    get placement() {
      const alignment = props.align ?? "center";
      const position = props.position ?? "bottom";

      return alignment === "center"
        ? position
        : (`${position}-${alignment}` as const);
    },
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    get middleware() {
      return [offset(5), flip(), shift()];
    },
  });

  return (
    <div
      {...elProps}
      ref={mergeRefs(elProps.ref, (ref) => setPopoverRef(ref))}
      style={combineStyle(elProps.style, {
        left: `${position?.x ?? 0}px`,
        top: `${position?.y ?? 0}px`,
      })}
      class={cn(
        "kria-fixed kria-z-[99999] kria-h-fit kria-overflow-y-auto kria-overflow-x-hidden kria-rounded-xl kria-box-border kria-p-2",
        elProps.class,
      )}
    >
      {elProps.children}
    </div>
  );
}
