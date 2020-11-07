/**
 * Класс который умеет слушать
 */
export class DomListener {
  constructor($root, listeners) {
    this.$root = $root;
    this.listeners = listeners || [];
  }

  addListener(listener) {
    this.listeners.push(listener);
    const methodName = getMethodName(listener);
    binding(
        [methodName],
        this,
        this.name + ' Conponent'
    );
    this.$root.on(listener, this[methodName]);
  }

  eraseListener(listener) {
    this.$root.off(listener, this[getMethodName(listener)]);
    this.listeners = this.listeners.filter((item) => item !== listener);
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

export function binding(functions, context, name) {
  functions.forEach((func) => {
    if (!context[func]) {
      throw new Error(
          `Method ${func} is not implemented in ${name}`
      );
    }
    context[func] = context[func].bind(context);
  });
}
