import {ExcelComponent} from '@core/ExcelComponent';

export class FormulaComponent extends ExcelComponent {
  static className = 'excel__formula';
  constructor($root) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'click'],
    });
  }

  onInput(event) {
    console.log(this);
    console.log(`${this.name} OnInput:`, event);
  }

  onClick(event) {
    console.log(`${this.name} onClick:`, event);
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
