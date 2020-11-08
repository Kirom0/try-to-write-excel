/**
 * Класс который умеет слушать
 */
import {$} from '@core/dom';

export class DomListener {
  constructor($root, listeners) {
    this.$root = $root;
    this.listeners = listeners || [];
    this.globalListeners = [];
  }

  addGlobalListener(listener) {
    if (this.globalListeners.includes(listener)) {
      return;
    }
    this.globalListeners.push(listener);
    const methodName = getMethodName(listener);
    binding(
        [methodName],
        this,
        this.name + ' Conponent'
    );
    $(document).on(listener, this[methodName]);
  }

  eraseGlobalListener(listener) {
    $(document).off(listener, this[getMethodName(listener)]);
    this.globalListeners = this.globalListeners.filter(
        (item) => item !== listener
    );
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
