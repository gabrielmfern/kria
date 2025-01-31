import { createMemo, For, Show } from "solid-js";
import { bibleTranslation } from "../../utils/bible-translation";
import { books, type BookName } from "../../utils/books";

interface PassageProps {
  book: BookName;
  chapter: number;
  verseRange: [start: number, end: number];
}

export function Passage(props: PassageProps) {
  const verses = createMemo(() => {
    const book = bibleTranslation.books.find((b) => b.name === props.book);
    const allVerses = book?.chapters[props.chapter];

    return allVerses?.slice(props.verseRange[0] - 1, props.verseRange[1]);
  });

  const chapterUrl = () => {
    const book = books.find((b) => b.name === props.book)!;
    const [abbreviation] = book.alternatives;

    return `https://bibliaonline.com.br/ara/${abbreviation.replace(" ", "")}/${props.chapter}}`;
  };

  return (
    <>
      <div class="kria-flex kria-flex-col kria-gap-2 !kria-select-text">
        <For
          each={verses()}
          fallback={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="kria-text-lg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <title>404 with falling blocks</title>
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="m9.592 8.277l-.898-1.384l3.46-2.247l.898 1.384zm-.485 2.282l-.899-1.384l-.898-1.384l-.9-1.383l1.385-.9l3.46-2.246l1.383-.899l.9 1.384l.898 1.384l.899 1.384l-1.384.899l-3.46 2.247zm4.47 4.063l1.697.865l-.1-1.903l-.188-3.61l-.1-1.902l-1.598 1.038l-3.032 1.968l-1.598 1.038l1.698.865zm-.1-1.903l-.09-1.707l-1.433.931zm4.258-.755h2.475v8.251h-2.475zm4.125-1.65v11.551h-5.775v-11.55zm-13.652.698l-3.76 10.922l-1.56-.537l3.76-10.922zm2.513 9.203a2.063 2.063 0 1 0 0-4.125a2.063 2.063 0 0 0 0 4.125m3.713-2.063a3.713 3.713 0 1 1-7.425 0a3.713 3.713 0 0 1 7.425 0"
                clip-rule="evenodd"
              />
            </svg>
          }
        >
          {(verse, i) => (
            <p class="kria-flex kria-gap-2 !kria-select-text">
              <span class="kria-text-sm !kria-select-text">
                {props.verseRange[0] + i()}
              </span>
              <span class="kria-flex-grow kria-text-wrap kria-whitespace-normal !kria-select-text">
                {verse}
              </span>
            </p>
          )}
        </For>
      </div>
      <Show when={verses()}>
        <a
          class="kria-ml-auto kria-text-sm kria-text-white kria-underline"
          href={chapterUrl()}
          target="noreferrer"
          rel="noopener"
        >
          See on bibliaonline.com.br
        </a>
      </Show>
    </>
  );
}
