import { describe, it, expect } from "vitest";
import { getUsfmPassageId } from "./route";

describe("Bible Passage USFM ID Parser", () => {
  it("translates single-word books correctly", () => {
    expect(getUsfmPassageId("Hebrews 11:1-6")).toBe("HEB.11.1-6");
    expect(getUsfmPassageId("Romans 10:9-17")).toBe("ROM.10.9-17");
    expect(getUsfmPassageId("Proverbs 3:5-6")).toBe("PRO.3.5-6");
  });

  it("translates multi-word books with numeric prefixes correctly", () => {
    expect(getUsfmPassageId("2 Corinthians 5:7")).toBe("2CO.5.7");
  });

  it("falls back gracefully when regex does not match", () => {
    expect(getUsfmPassageId("InvalidRef")).toBe("InvalidRef");
  });
});
