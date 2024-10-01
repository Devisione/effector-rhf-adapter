import type { FormState } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { createEffectorForm } from "../";

describe("Effector Form - Event tests", () => {
  it("should initialize $formState with null", () => {
    const form = createEffectorForm<any>();
    const initialFormState = form.$formState.getState();
    expect(initialFormState).toBeNull();
  });

  it("should update $formState when _setFormState is called", () => {
    const form = createEffectorForm<any>();
    const newFormState: FormState<any> = {
      defaultValues: undefined,
      isLoading: false,
      isDirty: true,
      isValid: false,
      isSubmitted: true,
      isSubmitting: false,
      isSubmitSuccessful: false,
      submitCount: 1,
      touchedFields: {},
      isValidating: false,
      dirtyFields: {},
      errors: {},
    };

    form._setFormState(newFormState);
    const updatedFormState = form.$formState.getState();
    expect(updatedFormState).toEqual(newFormState);
  });
});
