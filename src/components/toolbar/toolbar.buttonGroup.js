import {Controller} from '@/components/toolbar/toolbar.controller';
import {$} from '@core/dom';
import {stateToCssConfiguration} from '@/components/toolbar/toolbar.state&css';
import {Button} from '@/components/toolbar/toolbar.button';

export class ButtonGroup extends Controller {
  constructor(options) {
    super(options);
    const {metaData} = options;
    this.metaData = metaData;

    this.buttons = {};
    this.nameButtons = [];
    stateToCssConfiguration[this.name].value.forEach((btn) => {
      this.buttons[btn.name] = new Button(btn.name, btn['material-icon']);
      this.nameButtons.push(btn.name);
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
      name: this.name,
      ...this.metaData,
    };
    this.nameButtons.forEach((nameButton) => {
      const button = this.buttons[nameButton];
      button.init({
        ...inputProps,
        'data-name': button.name,
      },
      (value) => {
        if (value) {
          this.changeState(this.name, nameButton);
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

  onClick(event) {
    const $target = $(event.target);
    const name = $target.dataset['name'];
    this.clickHanlers[name]();
  }

  reset(value) {
    if (value === undefined) {
      value = this.defaultValue;
    }
    this.nameButtons
        .filter((buttonName) => buttonName !== value)
        .forEach((buttonName) => {
          this.buttons[buttonName].reset(false);
        });
    this.buttons[value].reset(true);
  }
}
