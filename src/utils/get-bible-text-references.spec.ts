import {
  getBibleTextReferences,
  type TextReference,
} from "./get-bible-text-references";

describe("getBibleTextReferences()", () => {
  it("should work with prefixes on verse", () => {
    expect(
      getBibleTextReferences(
        "Atos 4 v5; Atos 9, verso 4; Atos 10   , verso 10; Acts 3, verse 3; Acts 4 ver 2",
      ),
    ).toMatchSnapshot();
  });

  it("should work with lower case book names", () => {
    expect(
      getBibleTextReferences(
        "lorem ipsum test test test what acts 4:13, at 4:10, atos 10:14",
      ),
    ).toMatchSnapshot();
  });

  it("should not match without word boundaries", () => {
    expect(
      getBibleTextReferences("lorem ipsumat 5:20 bananaNeemias 10:30"),
    ).toEqual([]);
  });

  it("should work with common text references", () => {
    expect(
      getBibleTextReferences("João 3:13 Mateus 8 27 Mateus 14:25 Mateus 16:16"),
    ).toMatchSnapshot();
  });

  it("should work with abbreviations", () => {
    expect(getBibleTextReferences("1 Cr 2:3-4")).toMatchSnapshot();
  });
});
