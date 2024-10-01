import type { FieldPath, FieldValues } from "react-hook-form";
import type { NonEmptyArray } from "../types";
import type { FieldPath as WatchFieldPath } from "../rhf-rewrite-types";

// Пример использования
// isFieldChanged(["field"], "field"); // true
// isFieldChanged(["field"], "field.1.name"); // true
// isFieldChanged(["field.1"], "field.2.name"); // false
// isFieldChanged(["field.1.name"], "field.2.name"); // false
// isFieldChanged(["field.2.name"], "field.2.name"); // true
// isFieldChanged(["field.[].name"], "field.2.email"); // false
// isFieldChanged(["field.[].subfields.[]"], "field.1.subfields.2.name"); // true
// isFieldChanged(["field.1.subfields.1"], "field.1.subfields.2.name"); // false
// isFieldChanged(["field.1.subfields.1"], "field.1.subfields.1.name"); // true
// isFieldChanged(["field.[].subfields.[].name"], "field.1.subfields.2.name"); // true
// isFieldChanged(["field.[].subfields.[].email"], "field.1.subfields.2.name"); // false
export const isFieldChanged = <T extends FieldValues>(
  watchedFields: NonEmptyArray<WatchFieldPath<T>>,
  changedField: FieldPath<T>
): boolean => {
  const changedFieldParts = changedField.split(".");

  for (const field of watchedFields) {
    const fieldParts = field.split(".");

    let isMatch = true;

    for (let i = 0; i < fieldParts.length; i++) {
      const part = fieldParts[i]; // часть шаблона из watchedFields
      const changedPart = changedFieldParts[i]; // часть из измененного поля

      // Если шаблон допускает любой индекс, а часть измененного поля является числом
      if (part === "[]" && Number.isInteger(Number(changedPart))) {
        continue;
      }

      // Если текущая часть из watchedFields соответствует конкретному индексу (например "field.1")
      if (
        /^\[\d+\]$/.exec(part) &&
        part.replace(/\[|\]/g, "") === changedPart
      ) {
        continue;
      }

      // Проверка на соответствие частей поля
      if (part !== changedPart) {
        isMatch = false;
        break;
      }
    }

    // Если полностью совпадает либо подходит под шаблон
    if (isMatch) {
      return true;
    }
  }

  return false;
};
