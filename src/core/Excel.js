import {$} from '@core/dom';

export class Excel {
  constructor(selector, options) {
    this.$el = $(selector);
    this.components = (options.components || []).map(
        (Component) => new Component()
    );
    this.class = options.class || [];
  }

  getRoot() {
    const $root = $.create('div', this.class);
    this.components.forEach((component) => {
      const $el = $.create('div', component.constructor.className);
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
