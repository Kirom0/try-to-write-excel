export class Emitter {
  constructor() {
    this.listeners = {};

    this.emit = this.emit.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  emit(event, ...args) {
    const listeners = this.listeners[event] || [];
    listeners.forEach((listener) => listener(...args));
  }

  subscribe(event, fn) {
    let set = this.listeners[event];
    if (!set) {
      set = new Set();
      this.listeners[event] = set;
    }
    set.add(fn);
    return () => {
      set.delete(fn);
    };
  }
}

