import { useEffect } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";

interface UseFormChangeProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  onError: (errors: any) => void;
}

export const useFormError = <T extends FieldValues>({
  errors,
  onError,
}: UseFormChangeProps<T>) => {
  useEffect(() => {
    onError(errors);
  }, [JSON.stringify(errors), onError]);
};
