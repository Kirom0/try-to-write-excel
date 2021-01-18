import {ExcelComponent} from '@core/ExcelComponent';
import {etypes} from '@core/Emitter';

export class FormulaComponent extends ExcelComponent {
  static className = 'excel__formula';
  constructor($root, options = {}) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      ...options,
    });
    this.eTableSelectorSwitched = this.eTableSelectorSwitched.bind(this);
    this.eTableCurrentCellValue = this.eTableCurrentCellValue.bind(this);

    this.prepare();
  }

  prepare() {
    this.$on(etypes.TABLE_CURRENTCELL_SWITCHED, this.eTableSelectorSwitched);
    this.$on(etypes.TABLE_CURRENTCELL_VALUE_CHANGED, this.eTableCurrentCellValue);
  }

  init() {
    super.init();
    this.$formula = this.$root.querySelector('#formula');
  }

  eTableSelectorSwitched(tableCell) {
    this.$formula.nativeEl.value = tableCell.value;
  }

  eTableCurrentCellValue(value) {
    this.$formula.nativeEl.value = value;
  }

  onInput(event) {
    this.$emit(etypes.FORMULA_VALUE_CHANGED, this.$formula.value);
  }

  onKeydown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
    } else
    if (event.key === 'Enter') {
      event.preventDefault();
      this.$emit(etypes.FORMULA_ENTER);
    }
  }


  toHtml() {
    return `
      <div class="fx">fx</div>
      <div class="formula">
        <input 
            id="formula"
            type="text"
            placeholder="formula" 
            spellcheck="false"
        >
      </div>
    `;
  }
}
