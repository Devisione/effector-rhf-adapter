import { useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import isEqual from "lodash.isequal";
import { detectChanges } from "../utils/detectChanges";

interface UseFormChangeProps<T extends FieldValues> {
  control?: Control<T>;
  onChange: (values: T, name: FieldPath<T>) => void;
}

export const useFormChange = <T extends FieldValues>({
  control,
  onChange,
}: UseFormChangeProps<T>) => {
  const formValues = useWatch<T>({
    control,
  });

  const prevFormValues = useRef<typeof formValues>(formValues);

  useEffect(() => {
    if (!isEqual(formValues, prevFormValues.current)) {
      const changedFields = detectChanges(formValues, prevFormValues?.current);

      if (changedFields.length > 0) {
        changedFields.forEach((changedField) => {
          onChange(formValues as T, changedField.name as FieldPath<T>);
        });
      }

      prevFormValues.current = formValues;
    }
  }, [formValues, onChange]);
};
