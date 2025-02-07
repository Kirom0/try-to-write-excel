export class SumsArray {
  #array = [];
  #prefSum = [];
  #listeners;
  state;

  constructor(length=1, initialValue=0, changeListeners = []) {
    this.#array = (new Array(length)).fill(initialValue);
    this.#prefSum = this.#array.map((el, index) => el * (index + 1));
    console.log(this.#prefSum);
    this.#listeners = changeListeners;
    this._state = new Proxy(this, {
      set(target, prop, value) {
        if (prop in target) {
          new Error(`No ${prop} in target`);
          return false;
        }
        const difference = value - target.#array[prop];
        if (difference !== 0) {
          for (let i = prop; i < target.#prefSum.length; i++) {
            target.#prefSum[i] += difference;
          }
          target.#array[prop] = value;
          target.callListeners();
        }
        return true;
      },
      get(target, prop) {
        return target.#array[prop];
      },
    });
  }

  get state() {
    return this._state;
  }

  get length() {
    return this.#array.length;
  }

  sumBefore(index = 0) {
    return (index === 0) ? 0 : this.#prefSum[index - 1];
  }

  getTotalSum() {
    return this.#prefSum[this.#array.length - 1];
  }

  find(value) {
    let l = -1;
    let r = this.length - 1;
    let mid;
    while (l + 1 < r) {
      mid = (l + r) >> 1;
      if (this.#prefSum[mid] >= value) {
        r = mid;
      } else {
        l = mid;
      }
    }
    return r;
  }

  callListeners() {
    (new Promise((resolve, reject) => {
      resolve();
    })).then(()=>{
      this.#listeners.forEach((listener) => listener());
    });
  }

  addListener(listener) {
    this.#listeners.push(listener);
  }
}
