import {DomListener, getMethodName} from '@core/DomListener';


/**
 * Базовый эксель компонент
 */
export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || '';

    binding(
        [].concat(
            (options.listeners || []).map(getMethodName),
        ),
        this,
        this.name + ' Component'
    );
  }

  destroy() {
    this.removeListeners();
  }

  toHtml() {
    return '';
  }
}

function binding(functions, context, name) {
  functions.forEach((func) => {
    if (!context[func]) {
      throw new Error(
          `Method ${func} is not implemented in ${name}`
      );
    }
    context[func] = context[func].bind(context);
  });
}
