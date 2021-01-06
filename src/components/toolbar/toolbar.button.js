import {$} from '@core/dom';

export class Button {
  constructor(name, value) {
    this.name = name;
    this.value = value;

    this._isOn = false;
    this.toggleMode = true;

    Object.defineProperties(this, {
      isOn: {
        set(value) {
          const oldValue = this._isOn;
          this._isOn = value;
          if (!(value === oldValue)) {
            // Change state
            this.changeCB(value);
          }
        },
        get() {
          return this._isOn;
        },
      },
    });
  }

  init(inputProps, changeCB) {
    this.changeCB = changeCB;
    this.$elem = $.create('div', {class: 'button__container'})
        .setHtml(this.getHtml(inputProps));
  }

  getHtml(inputProps) {
    return `
    <input
      id="${this.name}"
      value="${this.name}"
      ${Object.keys(inputProps).map((key) => `${key}="${inputProps[key]}"`).join(' ')}
    >
    <label for="${this.name}">
      <i class="material-icons button">${this.value}</i>
    </label>
    `;
  }

  set toggleMode(flag) {
    this._toggleMode = flag;
  }

  get toggleMode() {
    return this._toggleMode;
  }

  toggle() {
    if (this.toggleMode) {
      this.isOn = !this.isOn;
    }
  }

  turnOn() {
    this.isOn = true;
  }

  turnOff() {
    this.isOn = false;
  }
}
