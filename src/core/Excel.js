import {$} from '@core/dom';
import {arrayFrom} from '@core/utils';

export class Excel {
  constructor(selector, options) {
    this.$el = $(selector);
    this.components = (options.components || []).map(
        (Component) => new Component()
    );
    this.classes = options.classes;
  }

  getRoot() {
    const $root = $.create('div', {
      class: arrayFrom(this.classes).join(' '),
    });
    this.components.forEach((component) => {
      const $el = $.create('div', {
        class: arrayFrom(component.constructor.className).join(' '),
      });
      $el.html = component.toHtml();

      component.$root = $el;
      $root.append($el);
    });
    return $root;
  }

  render() {
    this.$el.append(this.getRoot());
    this.components.forEach(
        (component) => {
          component.initListeners();
        });
  }
}
