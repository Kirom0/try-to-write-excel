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

  addGlobalListener(type, listener) {
    if (Object.prototype.hasOwnProperty.call(this.globalListeners, type)) {
      return;
    }
    listener = listener.bind(this);
    this.globalListeners[type] = listener;
    $(document).on(type, listener);
  }

  eraseGlobalListener(type) {
    $(document).off(type, this.globalListeners[type]);
    delete this.globalListeners[type];
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
