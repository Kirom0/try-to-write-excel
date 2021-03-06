import {arrayFrom} from '@core/utils';
import {$} from '@core/dom';

export class CSSRules {
  constructor(styles) {
    this.styles = styles || {};
    this._styleElement = $.create('style');
  }

  addRules(arrayOfRules) {
    arrayFrom(arrayOfRules).forEach((rules) => {
      Object.keys(rules).forEach((rule)=>{
        this.styles[rule] = {
          ...this.styles[rule],
          ...rules[rule],
        };
      });
    });
    this.reload();
  }

  deleteSelectorsRules(arrayOfSelector) {
    arrayFrom(arrayOfSelector).forEach((selector) => {
      delete this.styles[selector];
    });
    this.reload();
  }

  reload() {
    let result = '';
    Object.keys(this.styles).forEach((key) => {
      result += `${key}{${
        Object
            .keys(this.styles[key])
            .map(
                (innerKey)=>`${innerKey}:${this.styles[key][innerKey]};`
            )
            .join('')
      }}`;
    });

    this.styleElement.html = result;
  }

  get styleElement() {
    return this._styleElement;
  }
}

