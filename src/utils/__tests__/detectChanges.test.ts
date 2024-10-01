import { describe, expect, it } from "vitest";
import { detectChanges } from "../detectChanges";

describe("detectChanges", () => {
  it("should detect simple field changes", () => {
    const oldValues = { name: "Alice" };
    const newValues = { name: "Bob" };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([{ name: "name", newValue: "Bob" }]);
  });

  it("should detect nested object field changes", () => {
    const oldValues = { address: { city: "Wonderland" } };
    const newValues = { address: { city: "New Wonderland" } };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([
      { name: "address.city", newValue: "New Wonderland" },
    ]);
  });

  it("should detect array length changes", () => {
    const oldValues = { hobbies: ["reading", "chess"] };
    const newValues = { hobbies: ["reading", "chess", "running"] };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([
      { name: "hobbies", newValue: ["reading", "chess", "running"] },
    ]);
  });

  it("should detect changes within array elements", () => {
    const oldValues = { friends: [{ name: "Alice" }, { name: "Bob" }] };
    const newValues = { friends: [{ name: "Alice" }, { name: "Charlie" }] };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([{ name: "friends.1.name", newValue: "Charlie" }]);
  });

  it("should detect removed fields", () => {
    const oldValues = { name: "Alice", age: 30 };
    const newValues = { name: "Alice" };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([{ name: "age", newValue: undefined }]);
  });

  it("should detect added fields", () => {
    const oldValues = { name: "Alice" };
    const newValues = { name: "Alice", age: 30 };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([{ name: "age", newValue: 30 }]);
  });

  it("should detect nested added fields", () => {
    const oldValues = { address: { city: "Wonderland" } };
    const newValues = { address: { city: "Wonderland", zip: "12345" } };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([{ name: "address.zip", newValue: "12345" }]);
  });

  it("should detect complex changes", () => {
    const oldValues = {
      name: "Alice",
      address: { city: "Wonderland", street: "Queen St" },
      hobbies: ["reading", "chess"],
    };
    const newValues = {
      name: "Alice",
      address: { city: "Wonderland", street: "King St" },
      hobbies: ["reading", "chess", "running"],
    };
    const changes = detectChanges(newValues, oldValues);
    expect(changes).toEqual([
      { name: "address.street", newValue: "King St" },
      { name: "hobbies", newValue: ["reading", "chess", "running"] },
    ]);
  });
});
