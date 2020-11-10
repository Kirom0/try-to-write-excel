import {binding, DomListener, getMethodName} from '@core/DomListener';


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

  init() {
    this.$root.html = this.toHtml();
    this.initListeners();
  }

  destroy() {
    this.removeListeners();
  }

  toHtml() {
    return '';
  }
}
