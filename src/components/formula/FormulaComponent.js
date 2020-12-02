import {ExcelComponent} from '@core/ExcelComponent';

export class FormulaComponent extends ExcelComponent {
  static className = 'excel__formula';
  constructor($root, options = {}) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      ...options,
    });
    this.eTableSelectorSwitched = this.eTableSelectorSwitched.bind(this);
    this.eTableCellChanged = this.eTableCellChanged.bind(this);

    this.prepare();
  }

  prepare() {
    this.on('table:selector:switched', this.eTableSelectorSwitched);
    this.on('table:cell:changed', this.eTableCellChanged);
  }

  init() {
    super.init();
    this.$formula = this.$root.querySelector('#formula');
  }

  eTableSelectorSwitched(value) {
    this.$formula.nativeEl.value = value;
  }

  eTableCellChanged(value) {
    this.$formula.nativeEl.value = value;
  }

  onInput(event) {
    this.emitter.emit('formula:changed', this.$formula.value);
  }

  onKeydown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
    } else
    if (event.key === 'Enter') {
      event.preventDefault();
      this.emitter.emit('formula:enter');
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
