import { describe, expect, it } from "vitest";
import { isFieldChanged } from "../isFieldChanged";

describe("isFieldChanged", () => {
  it("should return true for an exact match", () => {
    const result = isFieldChanged(["field"], "field");
    expect(result).toBe(true);
  });

  it("should return true for a matching nested field", () => {
    const result = isFieldChanged(["field"], "field.1.name");
    expect(result).toBe(true);
  });

  it("should return false for a non-matching array field with a different index", () => {
    const result = isFieldChanged(["field.1"], "field.2.name");
    expect(result).toBe(false);
  });

  it("should return false for a non-matching nested field", () => {
    const result = isFieldChanged(["field.1.name"], "field.2.name");
    expect(result).toBe(false);
  });

  it("should return true for an exact match with index", () => {
    const result = isFieldChanged(["field.2.name"], "field.2.name");
    expect(result).toBe(true);
  });

  it("should return false for a different property in an array", () => {
    const result = isFieldChanged(["field.[].name"], "field.2.email");
    expect(result).toBe(false);
  });

  it("should return true for matching nested fields with arrays and indexes", () => {
    const result = isFieldChanged(
      ["field.[].subfields.[]"],
      "field.1.subfields.2.name"
    );
    expect(result).toBe(true);
  });

  it("should return false for non-matching nested fields with different indexes", () => {
    const result = isFieldChanged(
      ["field.1.subfields.1"],
      "field.1.subfields.2.name"
    );
    expect(result).toBe(false);
  });

  it("should return true for an exact match in nested fields with indexes", () => {
    const result = isFieldChanged(
      ["field.1.subfields.1"],
      "field.1.subfields.1.name"
    );
    expect(result).toBe(true);
  });

  it("should return true for matching nested fields with wildcard indexes", () => {
    const result = isFieldChanged(
      ["field.[].subfields.[].name"],
      "field.1.subfields.2.name"
    );
    expect(result).toBe(true);
  });

  it("should return false for non-matching properties in nested fields with wildcard indexes", () => {
    const result = isFieldChanged(
      ["field.[].subfields.[].email"],
      "field.1.subfields.2.name"
    );
    expect(result).toBe(false);
  });
});
