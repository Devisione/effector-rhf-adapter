import { useEffect } from "react";
import type { FormEvent } from "react";
import type { FieldValues } from "react-hook-form";
import { useUnit } from "effector-react";
import type { UseEffectorFormProps } from "./types";
import { useFormChange } from "./hooks/useFormChange";
import { useFormError } from "./hooks/useFormError";

export const useEffectorForm = <T extends FieldValues>({
  form,
  effectorForm,
}: UseEffectorFormProps<T>) => {
  const { onChange, onError, onSubmitEv, setFormValues, setFormState } =
    useUnit({
      onChange: effectorForm._onFormChangeTriggerEv,
      onError: effectorForm._onFormErrorTriggerEv,
      onSubmitEv: effectorForm.onFormSubmitEv,
      setFormValues: effectorForm._setFormValues,
      setFormState: effectorForm._setFormState,
    });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    return form.handleSubmit((data) => {
      onSubmitEv(data);
    })();
  };

  useFormError({
    errors: form.formState.errors,
    onError,
  });

  useFormChange({
    control: form.control,
    onChange: (values, name) => {
      onChange({ values, name });
      setFormValues(values);
    },
  });

  useEffect(() => {
    setFormValues(form.getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- специально для первого рендера проставление значений в стор
  }, []);

  useEffect(() => {
    setFormState(form.formState);
  }, [JSON.stringify(form)]);

  return {
    onSubmit,
  };
};
