import {Controller} from '@/components/toolbar/toolbar.controller';

export class ToggleButton extends Controller {
  constructor(button, options) {
    super(options);
    this.button = button;
    const {necessaryMeta, cssRule, cssValues} = options;
    this.necessaryMeta = necessaryMeta;
    this.cssRule = cssRule;
    this.cssValues = cssValues;
  }

  init() {
    this.button.init(
        {
          type: 'checkbox',
          ...this.necessaryMeta,
        },
        (value) => {
          this.changeState(this.button.name, value);
        }
    );
  }

  get$() {
    return this.button.$elem;
  }

  getState() {
    return {
      [this.button.name]: this.button.isOn,
    };
  }

  getCSSRules() {
    return {
      [this.cssRule]: this.cssValues[+this.button.isOn],
    };
  }

  onClick(event) {
    this.button.toggle();
  }
}
