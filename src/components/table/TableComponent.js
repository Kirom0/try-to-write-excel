import {ExcelComponent} from '@core/ExcelComponent';
import {
  getPureHtml, getTemplate,
} from '@/components/table/table.template';
import {CSSRules} from '@core/css';
import {TableCell} from '@/components/table/table.cell';
import {range} from '@core/utils';
import {
  Selector,
  shouldSelect,
} from '@/components/table/table.selector';
import {$} from '@core/dom';
import {SumsArray} from '@/components/table/SumsArray';
import {NewScroller} from '@/components/table/newScroller';
import {NewResizer} from '@/components/table/newResizer';

export class TableComponent extends ExcelComponent {
  static className = 'excel__table';
  constructor($root, options = {}) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
    this.rows = 30;
    this.cols = 20;

    this.eFormulaChanged = this.eFormulaChanged.bind(this);
    this.eFormulaEnter = this.eFormulaEnter.bind(this);

    this.prepare();
  }

  prepare() {
    this.cssRules = new CSSRules();
    this.columnSizes = new SumsArray(this.cols, 120, []);
    this.rowSizes = new SumsArray(this.rows, 24, []);
    this.selector = new Selector(this, this.rowSizes, this.columnSizes);

    this.cells = range(this.rows)
        .map((rowIndex) => {
          return range(this.cols).
              map((colIndex) => new TableCell(this, rowIndex, colIndex));
        });

    this.on('formula:changed', this.eFormulaChanged);
    this.on('formula:enter', this.eFormulaEnter);
  }

  initCells() {
    this.cells.forEach(
        (row) => row.forEach(
            (cell) => cell.init()
        )
    );
  }


  init() {
    // super.init();
    this.initListeners();
    this.initCells();
    this.htmlInitial();
    const $table = this.$root.querySelector('.table');

    this.HScroller = new NewScroller(
        this,
        'OX',
        $table.nativeEl,
        this.$root.querySelector('[data-type="columnsHeadline"]').nativeEl,
        this.$root.querySelector('[data-scroller="horizontal"]').nativeEl,
        this.columnSizes
    );
    this.HScroller.refresh();
    this.columnSizes.addListener(this.HScroller.refresh);

    this.VScroller = new NewScroller(
        this,
        'OY',
        $table.nativeEl,
        this.$root.querySelector('[data-type="rowsHeadline"]').nativeEl,
        this.$root.querySelector('[data-scroller="vertical"]').nativeEl,
        this.rowSizes
    );
    this.VScroller.refresh();
    this.rowSizes.addListener(this.VScroller.refresh);

    this.HResizer = new NewResizer(
        this,
        'OX',
        $table.nativeEl,
        this.$root.querySelector('[data-resizer=columns]').nativeEl,
        this.columnSizes
    );
    this.VResizer = new NewResizer(
        this,
        'OY',
        $table.nativeEl,
        this.$root.querySelector('[data-resizer=rows]').nativeEl,
        this.rowSizes
    );
    this.selector.init($table, this.cells);

    window.onresize = () => {
      this.HScroller.refresh();
      this.VScroller.refresh();
    };
  }

  eFormulaChanged(value) {
    this.selector.curCell.value = value;
  }

  eFormulaEnter() {
    this.selector.move.down();
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
      this.selector.mouseDownHandler(event);
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

  onKeydown(event) {
    this.selector.keyDownHandler(event);
  }

  onInput(event) {
    this.selector.curCell.updateValue();
  }

  htmlInitial() {
    console.log(this.cells);
    this.$root.append(getTemplate(this.cells, this.rows, this.cols));
  }

  toHtml() {
    console.log(this.rows, this.cols);
    this.$root.html = getPureHtml();
  }
}
