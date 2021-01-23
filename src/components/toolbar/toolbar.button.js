import {$} from '@core/dom';

export class Button {
  constructor(name, value) {
    this.name = name;
    this.value = value;

    this._isOn = false;

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
    this.$input = this.$elem.querySelector('input');
  }

  reset(value) { // Использовать только для изменения состояния кнопки без диспатча в стор
    value = value || false;
    this._isOn = value;
    this.$input.nativeEl.checked = value;
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

  toggle() {
    this.isOn = !this.isOn;
  }

  turnOn() {
    this.isOn = true;
  }

  turnOff() {
    this.isOn = false;
  }
}
