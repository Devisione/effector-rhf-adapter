import type {
  FieldErrors,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormState,
  SetValueConfig,
  UseFormReturn,
} from "react-hook-form";
import type { Event, EventCallable, Store, StoreWritable } from "effector";
import type { FieldPath as WatchFieldPath } from "./rhf-rewrite-types";

export type NonEmptyArray<T> = [T, ...T[]];

export interface FormChangeParams<T extends FieldValues> {
  values: T;
  name: FieldPath<T>;
}

export type WatcherEventChangeType<T extends FieldValues> = FormChangeParams<T>;
export type WatcherEventErrorType<T extends FieldValues> = FieldErrors<T>;

type WatcherEventTypes<T extends FieldValues> =
  | WatcherEventErrorType<T>
  | WatcherEventChangeType<T>;

type OnWatchFieldsChanges<T extends FieldValues> = (
  fieldsNames: NonEmptyArray<WatchFieldPath<T>>
) => Event<WatcherEventChangeType<T>>;

type OnWatchFieldsErrors<T extends FieldValues> = (
  fieldsNames: NonEmptyArray<WatchFieldPath<T>>
) => Event<WatcherEventErrorType<T>>;

export interface EffectorForm<T extends FieldValues> {
  onWatchFieldsChanges: OnWatchFieldsChanges<T>;
  onWatchFieldsErrors: OnWatchFieldsErrors<T>;
  onFormSubmitEv: EventCallable<T>;
  _setFormState: EventCallable<FormState<T> | null>;
  _onFormChangeTriggerEv: EventCallable<FormChangeParams<T>>;
  _onFormErrorTriggerEv: EventCallable<FieldErrors<T>>;
  _setFormValues: EventCallable<T>;
  $formValues: StoreWritable<T | null>;
  $formState: Store<EffectorFormState<T> | null>;
  $formInitialized: Store<boolean>;
  setValueEv: EventCallable<SetFormValueParams<T>>;
  setValuesEv: EventCallable<SetFormValuesParams<T>>;
}

export interface EffectorFormWatcher<T extends FieldValues> {
  fields: NonEmptyArray<string>;
  event: Event<WatcherEventTypes<T>>;
}

export interface UseEffectorFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  effectorForm: EffectorForm<T>;
}

export interface SetFormValueParams<T extends FieldValues> {
  name: FieldPath<T>;
  value: FieldPathValue<T, FieldPath<T>>;
  options?: SetValueConfig;
}
export interface SetFormValuesParams<T extends FieldValues> {
  fields: {
    name: SetFormValueParams<T>["name"];
    value: SetFormValueParams<T>["value"];
  }[];
  options?: SetFormValueParams<T>["options"];
}
export type EffectorFormStore<T extends FieldValues> = UseFormReturn<T>;
export type EffectorFormState<T extends FieldValues> = FormState<T>;
