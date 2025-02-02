import { createResource } from "solid-js";
import type { BookName } from "../utils/books";

export interface Translation {
  books: {
    abbrev: string;
    chapters: string[][];
    name: BookName;
  }[];
}

export const useTranslation = () => {
  const [translation] = createResource<Translation>(() =>
    fetch(chrome.runtime.getURL("AA.json")).then((res) => res.json()),
  );

  return translation;
};
