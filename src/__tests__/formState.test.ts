import type { FormState } from "react-hook-form";
import { beforeEach, describe, expect, it } from "vitest";
import { createEffectorForm } from "../";

describe("effector-rhf-adapter - $formState tests", () => {
  let effectorForm: ReturnType<typeof createEffectorForm<any>>;
  let mockFormState: FormState<any>;

  beforeEach(() => {
    effectorForm = createEffectorForm<any>();
    mockFormState = {
      defaultValues: undefined,
      isLoading: false,
      isValidating: false,
      isDirty: false,
      isValid: true,
      errors: {},
      touchedFields: {},
      dirtyFields: {},
      isSubmitted: false,
      isSubmitting: false,
      isSubmitSuccessful: false,
      submitCount: 0,
    };
  });

  it("should initialize $formState with null", () => {
    expect(effectorForm.$formState.getState()).toBeNull();
  });

  it("should update $formState when _setFormState is triggered", () => {
    effectorForm._setFormState(mockFormState);
    expect(effectorForm.$formState.getState()).toEqual(mockFormState);
  });
});
