import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  FormState,
} from "react-hook-form";
import { combine, createEvent, createStore, sample } from "effector";
import type { FieldPath as WatchFieldPath } from "./rhf-rewrite-types";
import type {
  EffectorForm,
  EffectorFormStore,
  EffectorFormWatcher,
  FormChangeParams,
  NonEmptyArray,
  SetFormValueParams,
  SetFormValuesParams,
  WatcherEventChangeType,
  WatcherEventErrorType,
} from "./types";
import { isFieldChanged } from "./utils/isFieldChanged";
import { getObjectKeys } from "./utils/getObjectKeys";

export const createEffectorForm = <
  T extends FieldValues
>(): EffectorForm<T> => {
  const $effectorFormStore = createStore<EffectorFormStore<T> | null>(null);

  const _setFormState = createEvent<FormState<T> | null>();

  const $formValues = createStore<T | null>(null, { skipVoid: false });
  const $formState = createStore<FormState<T> | null>(null, {
    skipVoid: false,
  }).on(_setFormState, (_, formState) => formState || null);

  const $watchers = createStore<EffectorFormWatcher<T>[]>([]);
  const addWatcherEv = createEvent<EffectorFormWatcher<T>>();

  $watchers.on(addWatcherEv, (state, payload) => [...state, payload]);

  const onWatchFieldsChanges = (
    watchedFields: NonEmptyArray<WatchFieldPath<T>>
  ) => {
    const watchersEvent = createEvent<WatcherEventChangeType<T>>();
    addWatcherEv({ fields: watchedFields, event: watchersEvent });

    sample({
      clock: _onFormChangeTriggerEv,
      filter: ({ name: changedField }) =>
        isFieldChanged(watchedFields, changedField),
      target: watchersEvent,
    });

    return watchersEvent;
  };

  const onWatchFieldsErrors = (
    watchedFields: NonEmptyArray<WatchFieldPath<T>>
  ) => {
    const watchersEvent = createEvent<WatcherEventErrorType<T>>();
    addWatcherEv({ fields: watchedFields, event: watchersEvent });

    sample({
      clock: _onFormErrorTriggerEv,
      filter: (errors) =>
        getObjectKeys(errors).some((name) =>
          isFieldChanged(watchedFields, name as FieldPath<T>)
        ),
      target: watchersEvent,
    });

    return watchersEvent;
  };

  const onFormSubmitEv = createEvent<T>();
  const setValueEv = createEvent<SetFormValueParams<T>>();
  const setValuesEv = createEvent<SetFormValuesParams<T>>();

  const _onFormChangeTriggerEv = createEvent<FormChangeParams<T>>();
  const _onFormErrorTriggerEv = createEvent<FieldErrors<T>>();

  const _setFormValues = createEvent<T>();
  const $formInitialized = combine($formValues, (formValues) =>
    Boolean(formValues)
  );

  sample({
    clock: setValueEv,
    source: $effectorFormStore,
    fn: (form, { name, value, options }: SetFormValueParams<T>) => {
      form?.setValue(name, value, options);
    },
  });

  sample({
    clock: setValuesEv,
    source: $effectorFormStore,
    fn: (form, { fields, options }: SetFormValuesParams<T>) => {
      fields.forEach(({ name, value }) => form?.setValue(name, value, options));
    },
  });

  sample({
    clock: _setFormValues,
    target: $formValues,
  });

  return {
    onWatchFieldsChanges,
    onWatchFieldsErrors,
    setValueEv,
    setValuesEv,
    onFormSubmitEv,
    _setFormState,
    _onFormChangeTriggerEv,
    _onFormErrorTriggerEv,
    _setFormValues,
    $formValues,
    $formState,
    $formInitialized,
  };
};
