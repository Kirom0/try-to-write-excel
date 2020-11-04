export function arrayFrom(value) {
  return value === undefined ? [] : (value instanceof Array ? value : [value]);
}

export function range(number) {
  const result = [];
  for (let i = 0; i < number; i++) {
    result.push(i);
  }
  return result;
}
