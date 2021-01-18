import {stateToCssConfiguration} from '@/components/toolbar/toolbar.state&css';

export class Controller {
  constructor(options) {
    this._state = {};
    const {name, changeEmitter} = options;
    this.name = name;
    this.changeEmitter = changeEmitter;
  }

  changeState(key, value) {
    this._state[key] = value;
    // eslint-disable-next-line no-debugger
    debugger;
    this.changeEmitter(this.state);
  }

  get state() {
    return {
      ...this._state,
    };
  }

  get$() {
    throw new Error('get$ is not implemented');
  }

  onClick() {
    throw new Error('onClick is not implemented');
  }

  getCSSRules() {
    throw new Error('getCSSRules is not implemented');
  }

  acceptValue(value) {
    throw new Error('acceptValue is not implemented');
  }

  setDefaultValue() {
    this.acceptValue(
        stateToCssConfiguration[this.name].default
    );
  }
}
