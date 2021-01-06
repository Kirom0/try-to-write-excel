import {Controller} from '@/components/toolbar/toolbar.controller';
import {$} from '@core/dom';

export class Selector extends Controller {
  constructor(values = [], options) {
    super(options);
    this.values = values;
  }

  init() {
    this.$elem = $.create('selector');
    this.values.forEach((value) => {
      this.$elem.append(
          $.create('option', {value: value.value})
              .setHtml(value.html)
      );
    });
  }
}
