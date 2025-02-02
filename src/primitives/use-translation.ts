import { createResource } from "solid-js";
import { createSingletonRoot } from "@solid-primitives/rootless";
import type { BookName } from "../utils/books";

interface Translation {
  books: {
    abbrev: string;
    chapters: string[][];
    name: BookName;
  }[];
}

export const useTranslation = createSingletonRoot(() => {
  const [translation] = createResource<Translation>(() =>
    fetch(chrome.runtime.getURL("AA.json")).then((res) => res.json()),
  );

  return translation;
});
