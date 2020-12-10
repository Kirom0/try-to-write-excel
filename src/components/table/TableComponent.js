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
import {NewScroller} from '@/components/table/newScroller';
import {NewResizer} from '@/components/table/newResizer';
import {parseId} from '@/components/table/table.functions';
import {SumsArrayWrapper} from '@/components/table/SumsArrayWrapper';
import {atype} from '@/redux/actions';

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

    this.subscribe([atype.TABLE_RESIZE], (state) => {
      console.log('Table Component state:', state);
    });

    this.prepare();
  }

  prepare() {
    this.cssRules = new CSSRules();
    this.columnSizes = new SumsArrayWrapper([this.cols, 120, []], (index) => `[data-column-title="${index}"]`);
    this.rowSizes = new SumsArrayWrapper([this.rows, 24, []], (index) => `[data-row-title="${index}"]`);
    this.selector = new Selector(this, this.rowSizes, this.columnSizes);

    this.cells = range(this.rows)
        .map((rowIndex) => {
          return range(this.cols).
              map((colIndex) => new TableCell(this, rowIndex, colIndex));
        });

    this.HScroller = new NewScroller(this, 'OX', this.columnSizes);
    this.VScroller = new NewScroller(this, 'OY', this.rowSizes);

    this.HResizer = new NewResizer(this, 'OX', this.columnSizes);
    this.VResizer = new NewResizer(this, 'OY', this.rowSizes);

    this.$on('formula:changed', this.eFormulaChanged);
    this.$on('formula:enter', this.eFormulaEnter);

    this.applyState();
  }

  applyState() {
    const state = this.store.get();
    const {columnSizes, rowSizes, cells} = state;

    Object.keys(columnSizes).forEach((key) => {
      this.HResizer.registerNewSize(key, columnSizes[key]);
    });
    Object.keys(rowSizes).forEach((key) => {
      this.VResizer.registerNewSize(key, rowSizes[key]);
    });
    Object.keys(cells).forEach((id) => {
      const [row, col] = parseId(id);
      this.cells[row][col].setInitValue(cells[id]);
    });
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

    this.HScroller.init(
        $table.nativeEl,
        this.$root.querySelector('[data-type="columnsHeadline"]').nativeEl,
        this.$root.querySelector('[data-scroller="horizontal"]').nativeEl
    );
    this.HScroller.refresh();
    this.columnSizes.addListener(this.HScroller.refresh);

    this.VScroller.init(
        $table.nativeEl,
        this.$root.querySelector('[data-type="rowsHeadline"]').nativeEl,
        this.$root.querySelector('[data-scroller="vertical"]').nativeEl
    );
    this.VScroller.refresh();
    this.rowSizes.addListener(this.VScroller.refresh);

    this.HResizer.init(
        $table.nativeEl,
        this.$root.querySelector('[data-resizer=columns]').nativeEl
    );
    this.VResizer.init(
        $table.nativeEl,
        this.$root.querySelector('[data-resizer=rows]').nativeEl
    );
    this.selector.init($table, this.cells);

    window.onresize = () => {
      this.HScroller.refresh();
      this.VScroller.refresh();
    };
  }

  isCellCurrent(tableCell) {
    return this.selector.isCurrent(tableCell);
  }

  dispatch(...args) {
    this.store.dispatch(...args);
  }

  eFormulaChanged(value) {
    this.selector.curCell.setValue = value;
  }

  eFormulaEnter() {
    this.selector.move.down();
  }

  resize(resizeHandler, orientation) {
    resizeHandler().then((data) => {
      console.log(data);
      this.store.dispatch({type: 'TABLE_RESIZE', orientation, data});
    });
  }

  onMousedown(event) {
    console.log('mousedown', event);
    const $target = $(event.target);

    if (this.HResizer.shouldResize($target)) {
      this.resize(() => this.HResizer.handler(event), 'column');
    } else if (this.VResizer.shouldResize($target)) {
      this.resize(() => this.VResizer.handler(event), 'row');
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
