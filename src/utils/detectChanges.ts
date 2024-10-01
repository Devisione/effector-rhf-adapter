interface Change {
  name: string;
  newValue: any;
}

/**
 * Обнаруживает изменения между двумя объектами одного типа и возвращает массив объектов Change.
 *
 * @param newValues - новый объект
 * @param oldValues - старый объект
 * @returns Массив различий - объектов Change.
 *
 * @example
 * const oldValues = { a: 1, b: { c: 2, d: 3 }, e: [4, 5] };
 * const newValues = { a: 1, b: { c: 3, d: 3 }, e: [4, 6], f: 7 };
 * const changes = detectChanges(newValues, oldValues);
 * console.log(changes);
 * // [
 * //   { name: 'b.c', newValue: 3 },
 * //   { name: 'e.1', newValue: 6 },
 * //   { name: 'f', newValue: 7 }
 * // ]
 */
export const detectChanges = <T extends Record<string, any>>(
  newValues: T,
  oldValues: T
): Change[] => {
  const changes: Change[] = [];

  const detect = ({
    path = "",
    newObj,
    oldObj,
  }: {
    path?: string;
    newObj?: T;
    oldObj?: T;
  }) => {
    for (const key in newObj) {
      if (Object.hasOwn(newObj, key)) {
        const newKeyValue = newObj[key];
        const oldKeyValue = oldObj ? oldObj[key] : undefined;
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof newKeyValue === "object" && newKeyValue !== null) {
          if (Array.isArray(newKeyValue)) {
            detectArray(currentPath, newKeyValue, oldKeyValue);
          } else {
            detect({
              path: currentPath,
              newObj: newKeyValue,
              oldObj: oldKeyValue,
            });
          }
        } else if (newKeyValue !== oldKeyValue) {
          changes.push({ name: currentPath, newValue: newKeyValue });
        }
      }
    }

    for (const key in oldObj) {
      if (Object.hasOwn(oldObj, key) && !Object.hasOwn(newObj!, key)) {
        const currentPath = path ? `${path}.${key}` : key;
        changes.push({ name: currentPath, newValue: undefined });
      }
    }
  };

  const detectArray = (path: string, newArr: T[], oldArr?: T[]) => {
    if (newArr.length !== oldArr?.length) {
      changes.push({ name: path, newValue: newArr });
    } else {
      newArr.forEach((item, index) => {
        detect({
          path: `${path}.${index}`,
          newObj: item,
          oldObj: oldArr[index],
        });
      });
    }
  };

  detect({ newObj: newValues, oldObj: oldValues });

  return changes;
};
