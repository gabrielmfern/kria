import { getBibleTextReferences } from "./get-bible-text-references";

describe("getBibleTextReferences()", () => {
  it("should work with common text references", () => {
    expect(
      getBibleTextReferences("João 3:13 Mateus 8 27 Mateus 14:25 Mateus 16:16"),
    ).toEqual([
      {
        book: "João",
        chapter: 3,
        index: 0,
        raw: "João 3:13",
        verseRange: [13, 13],
      },
      {
        book: "Mateus",
        chapter: 8,
        index: 10,
        raw: "Mateus 8 27",
        verseRange: [27, 27],
      },
      {
        book: "Mateus",
        chapter: 14,
        index: 22,
        raw: "Mateus 14:25",
        verseRange: [25, 25],
      },
      {
        book: "Mateus",
        chapter: 16,
        index: 35,
        raw: "Mateus 16:16",
        verseRange: [16, 16],
      },
    ]);
  });

  it("should work with abbreviations", () => {
    expect(getBibleTextReferences("1Cr 1; 1 Cr 1; 1 Cr 2:3-4")).toEqual([
      {
        book: "1 Crônicas",
        chapter: 1,
        index: 0,
        raw: "1Cr 1",
        verseRange: undefined,
      },
      {
        book: "1 Crônicas",
        chapter: 1,
        index: 7,
        raw: "1 Cr 1",
        verseRange: undefined,
      },
      {
        book: "1 Crônicas",
        chapter: 2,
        index: 15,
        raw: "1 Cr 2:3-4",
        verseRange: [3, 4],
      },
    ]);
  });
});
