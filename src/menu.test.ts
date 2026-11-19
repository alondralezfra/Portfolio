import { describe, expect, it } from "vitest";
import { collectTech, describeMatches, filterByStack, isLevel, type MenuItem } from "./menu";

function item(id: string, tech: string[]): MenuItem {
  return { id, title: id, summary: "", description: "", details: [], duration: "", tech };
}

const items = [item("a", ["React", "Go"]), item("b", ["React"]), item("c", ["Java", "Go", "Go"])];

describe("filterByStack", () => {
  it("returns every item when nothing is selected", () => {
    expect(filterByStack(items, new Set())).toHaveLength(3);
  });

  it("keeps only items using every selected ingredient", () => {
    expect(filterByStack(items, new Set(["React", "Go"])).map((i) => i.id)).toEqual(["a"]);
  });

  it("returns an empty list when no item uses all ingredients", () => {
    expect(filterByStack(items, new Set(["Java", "React"]))).toEqual([]);
  });

  it("does not mutate the input", () => {
    const copy = [...items];
    filterByStack(items, new Set(["Go"]));
    expect(items).toEqual(copy);
  });
});

describe("collectTech", () => {
  it("orders by use count then name and counts each item once", () => {
    expect(collectTech(items)).toEqual(["Go", "React", "Java"]);
  });

  it("is empty for no items", () => {
    expect(collectTech([])).toEqual([]);
  });
});

describe("describeMatches", () => {
  it("covers all, none and singular/plural cases", () => {
    expect(describeMatches(3, new Set())).toBe("Showing all 3 dishes.");
    expect(describeMatches(0, new Set(["Go"]))).toBe("No dishes use all of: Go.");
    expect(describeMatches(1, new Set(["Go"]))).toBe("1 dish uses all of: Go.");
    expect(describeMatches(2, new Set(["Go", "React"]))).toBe("2 dishes use all of: Go, React.");
  });
});

describe("isLevel", () => {
  it("accepts only known levels", () => {
    expect(isLevel("deep")).toBe(true);
    expect(isLevel("extra")).toBe(false);
  });
});
