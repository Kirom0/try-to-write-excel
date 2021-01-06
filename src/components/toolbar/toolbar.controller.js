export class Controller {
  constructor(options) {
    this._state = {};
    const {changeEmitter} = options;
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

  getCSSRules() {
    throw new Error('getCSSRules is not implemented');
  }
}
