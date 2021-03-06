import {SumsArray} from '@/components/table/SumsArray';
import {range} from '@core/utils';

export class SumsArrayWrapper extends SumsArray {
  constructor(setCSSFunction, props) {
    super(...props);
    this.setCSS = setCSSFunction;

    this.prepare();
  }

  prepare() {
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
}
