import {$} from '@core/dom';
import {arrayFrom} from '@core/utils';

export class Excel {
  constructor(selector, options) {
    this.$el = $(selector);
    this.components = (options.components || []).map(
        (Component) => new Component($.create('div', {
          class: arrayFrom(Component.className).join(' '),
        }))
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

  render() {
    this.$el.append(this.getRoot());
    this.components.forEach(
        (component) => {
          component.init();
        });
  }
}
