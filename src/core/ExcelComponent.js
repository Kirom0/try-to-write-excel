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

    this.store = options.store;

    binding(
        [].concat(
            (options.listeners || []).map(getMethodName),
        ),
        this,
        this.name + ' Component'
    );
  }

  $on(emitterEvent, fn) {
    this.unsubs.set(emitterEvent, this.emitter.subscribe(emitterEvent, fn));
  }

  $off(emitterEvent) {
    this.unsubs.delete(emitterEvent);
  }

  $emit(emitterEvent, ...data) {
    this.emitter.emit(emitterEvent, ...data);
  }

  subscribe(types, fn) {
    this.storeUnsub = this.store.subscribe(types, fn);
  }

  init() {
    this.$root.html = this.toHtml();
    this.initListeners();
  }

  destroy() {
    this.unsubs.forEach((unsub) => unsub());
    if (this.storeUnsub) {
      this.storeUnsub();
    }
    this.removeListeners();
  }

  toHtml() {
    return '';
  }
}
