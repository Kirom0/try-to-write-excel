import {ExcelComponent} from '@core/ExcelComponent';
import {getTemplate} from '@/components/table/table.template';

export class TableComponent extends ExcelComponent {
  static className = 'excel__table';
  toHtml() {
    return getTemplate(20, 35);
  }
}
