import {Controller} from '@/components/toolbar/toolbar.controller';
import {$} from '@core/dom';
import {controllersConfiguration} from '@/components/toolbar/toolbar.controller.config';

export class Selector extends Controller {
  constructor(options) {
    super(options);
    this.values = [];
    const {metaData} = options;
    this.metaData = metaData;
    controllersConfiguration[this.name].value.forEach((v) => {
      this.values.push(
          {
            value: v.name,
            html: v.html,
          }
      );
    });
    this._currentValue = this.defaultValue;

    Object.defineProperties(this, {
      currentValue: {
        set(value) {
          const oldValue = this._currentValue;
          this._currentValue = value;
          if (value !== oldValue) {
            this.changeState(this.name, value);
          }
        },
        get() {
          return this._currentValue;
        },
      },
    });
  }

  init() {
    this.$elem = $.create('select', {
      ...this.metaData,
    });
    this.values.forEach((value) => {
      this.$elem.append(
          $.create('option', {value: value.value})
              .setHtml(value.html)
      );
    });
  }

  get$() {
    return this.$elem;
  }

  onClick(event) {
    this.currentValue = event.target.value;
  }

  reset(value) {
    if (value === undefined) {
      value = this.defaultValue;
    }
    this._currentValue = value;
    this.$elem.nativeEl
        .querySelector(`option[value="${value}"]`).selected = true;
  }
}
