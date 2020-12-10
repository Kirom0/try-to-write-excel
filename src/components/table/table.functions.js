export function parseId(str) {
  return str.split(':').map((el) => parseInt(el));
}

export function toId(row, col) {
  return `${row}:${col}`;
}
