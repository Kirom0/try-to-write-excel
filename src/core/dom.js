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

  closest(selector) {
    return $(this.nativeEl.closest(selector));
  }

  getBoundingClientRect() {
    return this.nativeEl.getBoundingClientRect();
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.nativeEl;
    }
    this.nativeEl.append(node);
  }

  get dataset() {
    return this.nativeEl.dataset;
  }

  get classList() {
    return this.nativeEl.classList;
  }

  get parent() {
    return $(this.nativeEl.parentElement);
  }

  get style() {
    return this.nativeEl.style;
  }

  querySelector(selector) {
    return $(this.nativeEl.querySelector(selector));
  }

  getAttribute(attribute) {
    return this.nativeEl.getAttribute(attribute);
  }

  setStyle(styles) {
    Object.keys(styles).forEach((key)=>{
      this.nativeEl.style[key] = styles[key];
    });
  }
}


export function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, attributes = {}) => {
  const el = document.createElement(tagName);
  Object.keys(attributes).forEach((key)=>{
    el.setAttribute(key, attributes[key] || '');
  });
  return $(el);
};

