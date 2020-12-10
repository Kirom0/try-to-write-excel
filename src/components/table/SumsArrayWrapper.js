import {SumsArray} from '@/components/table/SumsArray';
import {CSSRules} from '@core/css';
import {range} from '@core/utils';

export class SumsArrayWrapper extends SumsArray {
  constructor(props, getSelector) {
    super(...props);
    this.getSelector = getSelector;

    this.prepare();
  }

  prepare() {
    this.cssRules = new CSSRules();
    this.state = new Proxy(this, {
      set(target, index, value) {
        target._state[index] = value; // Зашквар, конечно, но пока так
        target.setCSS(index, value);
        return true;
      },
      get(target, index) {
        return target._state[index];
      },
    });

    range(super.length).forEach((index) => this.setCSS(index, this.state[index]));
  }

  setCSS(index, value) {
    this.cssRules.addRules({
      [this.getSelector(index)]: {
        'flex-basis': value + 'px !important',
      },
    });
  }
}
