export const getObjectKeys = <T extends object>(
  obj: T,
  parentKey = ""
): string[] => {
  const keys: string[] = [];

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      keys.push(currentKey);

      if (value !== null && typeof value === "object") {
        keys.push(...getObjectKeys(value, currentKey));
      }
    }
  }

  return keys;
};
