export function parseId(str) {
  return str.split(':').map((el) => parseInt(el));
}
