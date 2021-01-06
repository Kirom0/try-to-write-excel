import {Controller} from '@/components/toolbar/toolbar.controller';
import {$} from '@core/dom';

export class ButtonGroup extends Controller {
  constructor(buttons = [], options) {
    super(options);
    const {unicButtonGroupName, necessaryMeta, cssRule, cssValues} = options;
    this.unicButtonGroupName = unicButtonGroupName;
    this.necessaryMeta = necessaryMeta;
    this.cssRule = cssRule;
    this.cssValues = cssValues;
    this.nameButtons = buttons.map((button) => button.name);
    this.buttons = {};
    buttons.forEach((button) => {
      this.buttons[button.name] = button;
    });

    this.prepare();
  }

  prepare() {
    this.clickHanlers = {};
    this.nameButtons.forEach((name) => {
      this.clickHanlers[name] =
        (function() {
          this.turnOn(name);
        }).bind(this);
    });
  }

  init() {
    const inputProps = {
      type: 'radio',
      name: this.unicButtonGroupName,
      ...this.necessaryMeta,
    };
    this.nameButtons.forEach((nameButton) => {
      const button = this.buttons[nameButton];
      button.init({
        ...inputProps,
        'data-name': button.name,
      },
      (value) => {
        if (value) {
          this.changeState(this.unicButtonGroupName, nameButton);
        }
      });
    });
  }

  get$() {
    return this.nameButtons.map((nameButton) => this.buttons[nameButton].$elem);
  }

  turnOn(name) {
    this.nameButtons
        .filter((buttonName) => buttonName !== name)
        .forEach((buttonName) => {
          this.buttons[buttonName].turnOff();
        });
    this.buttons[name].turnOn();
  }


  getCSSRules() {
    return {
      [this.cssRule]: this.cssValues[this.state[this.unicButtonGroupName]],
    };
  }

  onClick(event) {
    const $target = $(event.target);
    const name = $target.dataset['name'];
    this.clickHanlers[name]();
  }
}
