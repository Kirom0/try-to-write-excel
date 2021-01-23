import {controllersConfiguration} from '@/components/toolbar/toolbar.controller.config';

export class Controller {
  constructor(options) {
    this._state = {};
    const {name, changeEmitter} = options;
    this.name = name;
    this.changeEmitter = changeEmitter;
  }

  changeState(key, value) {
    this._state[key] = value;
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

  reset(value) {
    throw new Error('"reset" method is not implemented');
  }

  get defaultValue() {
    return controllersConfiguration[this.name].default;
  }
}
