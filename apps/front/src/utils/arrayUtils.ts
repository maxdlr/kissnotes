export const arrayUnique = <T>(array: T[], uniqueBy: keyof T): T[] => {
  if (typeof array[0] === "string" || typeof array[0] === "number") {
    return Array.from(new Set(array));
  }
  return Array.from(new Set(array.map((item) => item[uniqueBy])))
    .map((prop) => array.find((item) => item[uniqueBy] === prop))
    .filter((t) => Boolean(t)) as T[];
};
