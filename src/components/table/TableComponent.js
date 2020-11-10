import {ExcelComponent} from '@core/ExcelComponent';
import {getTemplate} from '@/components/table/table.template';
import {CSSRules} from '@core/css';
import {shouldResize} from '@/components/table/table.functions';
import {resizeHandler} from '@/components/table/table.resizing';

export class TableComponent extends ExcelComponent {
  static className = 'excel__table';
  constructor($root) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
    });
    this.css = new CSSRules();
  }

  onMousedown(event) {
    console.log('mousedown', event);
    if (shouldResize(event)) {
      resizeHandler(this, event);
    }
  }

  toHtml() {
    return getTemplate(3, 3);
  }
}
