import "./extension.css";
import { Highlighter } from "./components/highlighter";
import { BibleReferences } from "./components/bible-references";

export function Extension() {
  return (
    <>
      <Highlighter />
      <BibleReferences />
    </>
  );
}
