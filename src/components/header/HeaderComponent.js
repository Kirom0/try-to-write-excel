import {ExcelComponent} from '@core/ExcelComponent';

export class HeaderComponent extends ExcelComponent {
  static className = ['excel__header', 'box-shadow'];
  toHtml() {
    return `
    <input class="input" type="text" value="Новая таблица">
    <div class="icons">
      <i class="material-icons button">delete_forever</i>
      <i class="material-icons button">close</i>
    </div>
    `;
  }
}
