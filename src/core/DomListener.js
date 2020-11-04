/**
 * Класс который умеет слушать
 */
export class DomListener {
  constructor($root, listeners) {
    this.$root = $root;
    this.listeners = listeners || [];
  }

  initListeners() {
    console.log(this.listeners);
    this.listeners.forEach((listener) => {
      this.$root.on(listener, this[getMethodName(listener)]);
    });
  }

  removeListeners() {
    this.listeners.forEach((listener) => {
      this.$root.off(listener, this[getMethodName(listener)]);
    });
  }
}

export function getMethodName(name) {
  if (!name) {
    return '';
  }
  return 'on' + name.charAt(0).toUpperCase() + name.slice(1);
}
