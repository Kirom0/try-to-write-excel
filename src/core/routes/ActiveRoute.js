export class ActiveRoute {
  static get hash() {
    return window.location.hash.slice(1);
  }

  static get param() {
    return ActiveRoute.hash.split('/');
  }
}
