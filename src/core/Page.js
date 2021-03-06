export class Page {
  constructor(params) {
    this.params = params;
  }

  getRoot() {
    throw new Error('"getRoot" is not implemented');
  }

  init() {
    throw new Error('"init" is not implemented');
  }

  destroy() {
    throw new Error('"destroy" is not implemented');
  }
}
