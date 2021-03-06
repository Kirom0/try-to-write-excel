import {$} from '@core/dom';
import {arrayFrom} from '@core/utils';
import {Emitter} from '@core/Emitter';

export class Excel {
  constructor(options) {
    this.emitter = new Emitter();
    const componentsOptions = {
      emitter: this.emitter,
      store: options.store,
    };
    this.components = (options.components || []).map(
        (Component) => new Component(
            $.create(
                'div',
                {
                  class: arrayFrom(Component.className).join(' '),
                }),
            componentsOptions
        )
    );
    this.classes = options.classes;
  }

  getRoot() {
    const $root = $.create('div', {
      class: arrayFrom(this.classes).join(' '),
    });
    this.components.forEach((component) => {
      $root.append(component.$root);
    });
    return $root;
  }

  init() {
    this.components.forEach(
        (component) => {
          component.init();
        });
  }

  destroy() {
    this.components.forEach((component) => {
      component.destroy();
    });
  }
}
