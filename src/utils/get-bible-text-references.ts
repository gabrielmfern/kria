import {
  anyOf,
  buildRegExp,
  capture,
  charClass,
  choiceOf,
  digit,
  negated,
  nonWhitespace,
  oneOrMore,
  optional,
  zeroOrMore,
} from "ts-regex-builder";
import { type BookName, books } from "./books";

const bookName = choiceOf(
  ...books.map((book) => book.name),
  ...books.flatMap((book) => book.alternatives),
);

const whitespace = negated(charClass(nonWhitespace, anyOf("\r\n")));

const referenceSeparator = choiceOf(
  [zeroOrMore(whitespace), ":", zeroOrMore(whitespace)],
  [oneOrMore(whitespace)],
);

const bibleTextRegex = buildRegExp(
  [
    capture(bookName, {
      name: "book",
    }),
    referenceSeparator,
    capture(oneOrMore(digit), {
      name: "chapter",
    }),
    referenceSeparator,
    capture(oneOrMore(digit), { name: "verse_start" }),
    optional([
      zeroOrMore(whitespace),
      "-",
      zeroOrMore(whitespace),
      capture(oneOrMore(digit), { name: "verse_end" }),
    ]),
  ],
  {
    global: true,
  },
);

export interface TextReference {
  raw: string;
  index: number;

  book: BookName;
  chapter: number;
  verseRange: [start: number, end: number];
}

export function getBibleTextReferences(content: string) {
  const references: TextReference[] = [];

  for (const match of content.matchAll(bibleTextRegex)) {
    const groups = match.groups;
    if (groups) {
      const { book, chapter, verse_start, verse_end } = groups;
      const properBook = books.find(
        ({ name, alternatives }) =>
          (alternatives as string[]).includes(book) || name === book,
      );
      if (properBook) {
        references.push({
          book: properBook.name,
          index: match.index,
          raw: match[0],
          chapter: Number.parseInt(chapter),
          verseRange: [
            Number.parseInt(verse_start),
            verse_end
              ? Number.parseInt(verse_end)
              : Number.parseInt(verse_start),
          ],
        });
      }
    }
  }

  // resets the regex to avoid issues
  bibleTextRegex.lastIndex = 0;

  return references;
}
