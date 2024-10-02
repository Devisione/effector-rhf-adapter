# effector-rhf-adapter

**effector-rhf-adapter** — это библиотека, которая интегрирует [React Hook Form](https://react-hook-form.com/) с [Effector](https://effector.dev/) для управления формами в приложениях React. Он позволяет отслеживать изменения полей формы, ошибки, состояние формы и обрабатывать отправку данных с использованием возможностей реактивного управления состоянием Effector. С помощью этой библиотеки вы можете легко подписываться на изменения, контролировать ошибки и обновлять значения полей на основе событий Effector.

## Installation

```sh
yarn add effector-rhf-adapter
```

## API

**index.tsx** (cвязка формы React-hook-form и Effector)
```typescript jsx
import { FormProvider, useForm } from "react-hook-form";
import { useEffectorForm } from "effector-rhf-adapter";
import { createDeliveryEffectorForm } from "../../model/store";
import { FormType } from "../../model/form";

export const CreateDeliveryForm = () => {
    const form = useForm<CreateDeliveryFormType>();
    const { onSubmit } = useEffectorForm({
        form,
        effectorForm: createDeliveryEffectorForm,
    });

    return (
        <>
            <FormProvider {...form}>
                <form onSubmit={onSubmit}>
                {/*  fields...  */}
                </form>
            </FormProvider>
        </>
    );
};
```


**store.ts**
```typescript jsx
import { createEffect, createStore, sample } from "effector";
import { createEffectorForm } from "effector-rhf-adapter";
import { CreateDeliveryFormType } from "../../form";

const createDeliveryEffectorForm = createEffectorForm<CreateDeliveryFormType>();

const exampleFx = createEffect((params) => {
    console.log("Field changed params:", params);
});
const setContainerWeightEv = createEvent<string>();
const setContainersWeightEv = createEvent<string[]>();

// Пример подписки на изменение полей
sample({
    clock: createDeliveryEffectorForm.onWatchFieldsChanges([
        "containers.[].cargos.[].weight",
        "containers.[].cargos.cost",
    ]),
    target: exampleFx,
});

// Пример подписки на ошибки полей
sample({
    clock: createDeliveryEffectorForm.onWatchFieldsErrors([
        "containers.[].cargos.[].weight",
        "containers.[].cargos.cost",
    ]),
    target: exampleFx,
});

// Пример подписки на submit
sample({
    clock: createDeliveryEffectorForm.onFormSubmitEv(),
    target: exampleFx,
});

// Пример отслеживания изменения formState
sample({
    clock: createDeliveryEffectorForm.$formState,
    filter: (formState) => Boolean(formState),
    target: exampleFx,
});

// Пример изменения значения поля формы по событию
sample({
    clock: setContainerWeightEv,
    fn: (value) => ({ name: "container.0.weight", value }),
    target: createDeliveryEffectorForm.setValueEv,
});

// Пример изменения значений полей формы по событию
sample({
    clock: setContainersWeightEv,
    fn: (containersWeight) => ({
        fields: containersWeight.map((weight, index) => ({
            name: `container.${index}.weight`,
            value: weight,
        })),
    }),
    target: testForm.setValuesEv,
});

export { createDeliveryEffectorForm };
```

Методы отслеживания ошибок и изменений значения полей формы принимают один параметр - это массив строк, где каждый элемент массива это название отслеживаемого поля ввиде шаблона.

Измененное поле сопоставляется с массивом шаблонов и проверяется на соответствие методом **isFieldChanged**

**Примеры работы шаблонов:**

```typescript
isFieldChanged(["field"], "field"); // true
isFieldChanged(["field"], "field.1.name"); // true
isFieldChanged(["field.1"], "field.2.name"); // false
isFieldChanged(["field.1.name"], "field.2.name"); // false
isFieldChanged(["field.2.name"], "field.2.name"); // true
isFieldChanged(["field.[].name"], "field.2.email"); // false
isFieldChanged(["field.[].subfields.[]"], "field.1.subfields.2.name"); // true
isFieldChanged(["field.1.subfields.1"], "field.1.subfields.2.name"); // false
isFieldChanged(["field.1.subfields.1"], "field.1.subfields.1.name"); // true
isFieldChanged(["field.[].subfields.[].name"], "field.1.subfields.2.name"); // true
isFieldChanged(["field.[].subfields.[].email"], "field.1.subfields.2.name"); // false
```

## License
MIT