import {binding, DomListener, getMethodName} from '@core/DomListener';


/**
 * Базовый эксель компонент
 */
export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || '';

    this.emitter = options.emitter;
    this.unsubs = new Map();

    binding(
        [].concat(
            (options.listeners || []).map(getMethodName),
        ),
        this,
        this.name + ' Component'
    );
  }

  on(emitterEvent, fn) {
    this.unsubs.set(emitterEvent, this.emitter.subscribe(emitterEvent, fn));
  }

  off(emitterEvent) {
    this.unsubs.delete(emitterEvent);
  }

  init() {
    this.$root.html = this.toHtml();
    this.initListeners();
  }

  destroy() {
    this.unsubs.forEach((unsub) => unsub());
    this.removeListeners();
  }

  toHtml() {
    return '';
  }
}
