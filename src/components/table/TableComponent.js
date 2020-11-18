import {ExcelComponent} from '@core/ExcelComponent';
import {
  cellInitial, getPureHtml,
  getSmartTemplate,
} from '@/components/table/table.template';
import {CSSRules} from '@core/css';
import {shouldResize} from '@/components/table/table.functions';
import {resizeHandler} from '@/components/table/table.resizing';
import {TableCell} from '@/components/table/table.cell';
import {range} from '@core/utils';
import {
  Selector,
  selectorHandler,
  shouldSelect,
} from '@/components/table/table.selector';
import {
  initScroll,
  scrollHandler,
  shouldScroll,
} from '@/components/table/table.scroller';
import {$} from '@core/dom';

export class TableComponent extends ExcelComponent {
  static className = 'excel__table';
  constructor($root, rows, cols) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
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
    // this.htmlInitial();
    this.toHtml();
    this.selector = new Selector(this.cells);
    this.selector.select(0, 0);
    this.columnSizes = (new Array(15)).fill(120);
    this.rowSizes = (new Array(9)).fill(77);
    initScroll(this);
  }


  onMousedown(event) {
    console.log('mousedown', event);
    const $target = $(event.target);
    if (shouldResize(event)) {
      resizeHandler(this, event);
    } else if (shouldSelect(event)) {
      selectorHandler(this, event);
    } else if (shouldScroll(event, $target)) {
      scrollHandler(this, event, $target);
    }
  }

  htmlInitial() {
    console.log(this.cells);
    getSmartTemplate(this.cells, this.rows, this.cols)
        .forEach(($el) => this.$root.append($el));
  }

  toHtml() {
    console.log(this.rows, this.cols);
    // return getTemplate(this.rows, this.cols);
    this.$root.html = getPureHtml();
  }
}
