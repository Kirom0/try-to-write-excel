import {forEachExtension} from '@core/utils';

class Dom {
  constructor(selector) {
    this.nativeEl =
      (typeof selector === 'string') ?
        document.querySelector(selector) :
        selector;
  }

  set html(html) {
    this.nativeEl.innerHTML = html;
  }

  setHtml(html) {
    this.html = html;
    return this;
  }

  get html() {
    return this.nativeEl.outerHTML;
  }

  clear() {
    this.html = '';
  }

  on(eventType, callback) {
    this.nativeEl.addEventListener(eventType, callback);
  }

  off(eventType, callback) {
    this.nativeEl.removeEventListener(eventType, callback);
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.nativeEl;
    }
    this.nativeEl.append(node);
  }
}


export function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, classes = '') => {
  const el = document.createElement(tagName);
  forEachExtension(classes, (_class) => {
    el.classList.add(_class);
  });
  return $(el);
};

