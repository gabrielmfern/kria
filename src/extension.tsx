import { Show } from "solid-js";
import { createContextProvider } from "@solid-primitives/context";
import { BibleReferences } from "./components/bible-references";
import { useTranslation, type Translation } from "./primitives/use-translation";

const [ExtensionProvider, useExtension] = createContextProvider(
  (props: { translation: Translation }) => {
    return {
      get translation() {
        return props.translation;
      },
    };
  },
);

export function Extension() {
  const translation = useTranslation();

  return (
    <Show when={translation()}>
      <ExtensionProvider translation={translation()!}>
        <BibleReferences />
        {/* <Highlighter /> */}
      </ExtensionProvider>
    </Show>
  );
}

export { useExtension };
