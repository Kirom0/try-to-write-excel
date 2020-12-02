export class Emitter {
  constructor() {
    this.listeners = {};
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

