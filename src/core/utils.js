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

export function storage(key, value) {
  if (!value) {
    try {
      return JSON.parse(localStorage.getItem(key) || undefined);
    } catch (e) {
      return undefined;
    }
  }
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
