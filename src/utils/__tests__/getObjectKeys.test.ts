import { describe, expect, it } from "vitest";
import { getObjectKeys } from "../getObjectKeys";

describe("getObjectKeys", () => {
  it("getObjectKeys should return correct keys for nested objects", () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      f: [4, 5, { g: 6 }],
    };

    const keys = getObjectKeys(obj);
    expect({ keys }).toEqual({
      keys: expect.arrayContaining([
        "a",
        "b",
        "b.c",
        "b.d",
        "b.d.e",
        "f",
        "f.0",
        "f.1",
        "f.2",
        "f.2.g",
      ]),
    });
  });

  it("getObjectKeys should handle empty object", () => {
    const obj = {};

    const keys = getObjectKeys(obj);
    expect({ keys }).toEqual({
      keys: expect.arrayContaining([]),
    });
  });

  it("getObjectKeys should handle null values", () => {
    const obj = {
      a: null,
      b: {
        c: 1,
        d: null,
      },
    };

    const keys = getObjectKeys(obj);
    expect({ keys }).toEqual({
      keys: expect.arrayContaining(["a", "b.c", "b.d"]),
    });
  });
});
