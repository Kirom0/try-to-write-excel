import {ExcelComponent} from '@core/ExcelComponent';

export class ToolbarComponent extends ExcelComponent {
  static className = ['excel__toolbar', 'box-shadow'];
  toHtml() {
    return `
      <i class="material-icons button">format_align_left</i>
      <i class="material-icons button">format_align_center</i>
      <i class="material-icons button">format_align_right</i>
      <i class="material-icons button">format_bold</i>
      <i class="material-icons button">format_italic</i>
      <i class="material-icons button">format_underlined</i>
    `;
  }
}
