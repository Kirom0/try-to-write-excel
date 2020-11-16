import {ExcelComponent} from '@core/ExcelComponent';
import {
  cellInitial, getNumberByLitter,
  getSmartTemplate,
  getTemplate,
} from '@/components/table/table.template';
import {CSSRules} from '@core/css';
import {shouldResize} from '@/components/table/table.functions';
import {resizeHandler} from '@/components/table/table.resizing';
import {TableCell} from '@/components/table/table.cell';
import {range} from '@core/utils';
import {$} from '@core/dom';
import {Selector} from '@/components/table/table.selector';

export class TableComponent extends ExcelComponent {
  static className = 'excel__table';
  constructor($root, rows, cols) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'click'],
    });
    this.rows = rows || 10;
    this.cols = cols || 20;
    this.cssRules = new CSSRules();
  }

  initCells() {
    this.cells = range(this.rows)
        .map((rowIndex) => {
          return range(this.cols)
              .map((colIndex) =>
                new TableCell(
                    rowIndex,
                    colIndex,
                    cellInitial(rowIndex, colIndex)
                )
              );
        });
  }


  init() {
    // super.init();
    this.initListeners();
    this.initCells();
    this.htmlInitial();
    this.selector = new Selector(this.cells);
    this.selector.select(0, 0);
  }


  onMousedown(event) {
    console.log('mousedown', event);
    if (shouldResize(event)) {
      resizeHandler(this, event);
    }
  }

  onClick(event) {
    const $el = $(event.target);
    // console.log($el.dataset);
    const row = $el.dataset['rowTitle'];
    const col = getNumberByLitter($el.dataset['columnTitle']);
    this.selector.select(row, col);
    // console.log(row, col);
  }

  htmlInitial() {
    console.log(this.cells);
    getSmartTemplate(this.cells, this.rows, this.cols)
        .forEach(($el) => this.$root.append($el));
  }

  toHtml() {
    console.log(this.rows, this.cols);
    return getTemplate(this.rows, this.cols);
  }
}
