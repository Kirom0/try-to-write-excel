import {ExcelComponent} from '@core/ExcelComponent';
import {
  cellInitial, getPureHtml,
  getSmartTemplate,
} from '@/components/table/table.template';
import {CSSRules} from '@core/css';
import {TableCell} from '@/components/table/table.cell';
import {range} from '@core/utils';
import {
  Selector,
  selectorHandler,
  shouldSelect,
} from '@/components/table/table.selector';
import {$} from '@core/dom';
import {SumsArray} from '@/components/table/SumsArray';
import {NewScroller} from '@/components/table/newScroller';
import {NewResizer} from '@/components/table/newResizer';

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
    this.columnSizes = new SumsArray(4, 120, []);
    this.HScroller = new NewScroller(
        this,
        'OX',
        this.$root.querySelector('.table').nativeEl,
        this.$root.querySelector('[data-type="columnsHeadline"]').nativeEl,
        this.$root.querySelector('[data-scroller="horizontal"]').nativeEl,
        this.columnSizes
    );
    this.HScroller.refresh();
    this.columnSizes.addListener(this.HScroller.refresh);

    this.rowSizes = new SumsArray(9, 24, []);
    this.VScroller = new NewScroller(
        this,
        'OY',
        this.$root.querySelector('.table').nativeEl,
        this.$root.querySelector('[data-type="rowsHeadline"]').nativeEl,
        this.$root.querySelector('[data-scroller="vertical"]').nativeEl,
        this.rowSizes
    );
    this.VScroller.refresh();
    this.rowSizes.addListener(this.VScroller.refresh);

    this.HResizer = new NewResizer(
        this,
        'OX',
        this.$root.querySelector('.table').nativeEl,
        this.$root.querySelector('[data-resizer=columns]').nativeEl,
        this.columnSizes
    );
    this.VResizer = new NewResizer(
        this,
        'OY',
        this.$root.querySelector('.table').nativeEl,
        this.$root.querySelector('[data-resizer=rows]').nativeEl,
        this.rowSizes
    );

    window.onresize = () => {
      this.HScroller.refresh();
      this.VScroller.refresh();
    };
  }


  onMousedown(event) {
    console.log('mousedown', event);
    const $target = $(event.target);

    if (this.HResizer.shouldResize($target)) {
      this.HResizer.handler(event);
    } else if (this.VResizer.shouldResize($target)) {
      this.VResizer.handler(event);
    } else

    if (shouldSelect(event)) {
      selectorHandler(this, event);
    } else

    if ($target.classList.contains('horizontalScroller')) {
      this.HScroller.handler(event);
    } else if ($target.classList.contains('verticalScroller')) {
      this.VScroller.handler(event);
    } else

    if ($target.nativeEl.id === 'scroll') {
      switch ($target.dataset['scroll']) {
        case 'left':
          this.HScroller.changeCurrent(-1);
          break;
        case 'right':
          this.HScroller.changeCurrent(1);
          break;
        case 'up':
          this.VScroller.changeCurrent(-1);
          break;
        case 'down':
          this.VScroller.changeCurrent(1);
          break;
      }
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
