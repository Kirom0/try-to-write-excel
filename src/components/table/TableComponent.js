import {ExcelComponent} from '@core/ExcelComponent';
import {getTemplate} from '@/components/table/table.template';

export class TableComponent extends ExcelComponent {
  static className = 'excel__table';
  constructor($root) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
    });
  }

  onMousemove(event) {
    console.log('mousemove', event);
  }

  onMousedown(event) {
    console.log('mousedown', event);
    if (event.target.classList.contains('column__resizer')) {
      this.addListener('mousemove');
      this.addListener('mouseup');
    }
  }

  onMouseup(event) {
    console.log('mouseup', event);
    this.eraseListener('mousemove');
    this.eraseListener('mouseup');
  }

  toHtml() {
    return getTemplate(3, 3);
  }
}
