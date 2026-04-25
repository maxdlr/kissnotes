export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
};

export const asTitle = (str: string): string => {
  const capitalized = str.at(0)?.toUpperCase();
  const rest = str.slice(1, str.length);

  return `${capitalized}${rest}`;
};
