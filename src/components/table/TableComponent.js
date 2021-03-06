import {Component} from '@core/Component';
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
import {etypes} from '@core/Emitter';
import {initCellDecoration} from '@/components/toolbar/toolbar.functions';

export class TableComponent extends Component {
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
    const getSetCSSFunction = (getSelector) =>
      (index, value) => {
        this.cssRules.addRules({
          [getSelector(index)]: {
            'flex-basis': value + 'px !important',
          },
        });
      };
    this.columnSizes = new SumsArrayWrapper(
        getSetCSSFunction((index) => `[data-column-title="${index}"]`),
        [this.cols, 120, []],
    );
    this.rowSizes = new SumsArrayWrapper(
        getSetCSSFunction((index) => `[data-row-title="${index}"]`),
        [this.rows, 24, []]);
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

    this.$on(etypes.FORMULA_VALUE_CHANGED, this.eFormulaChanged);
    this.$on(etypes.FORMULA_ENTER, this.eFormulaEnter);

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
      this.cells[row][col].setInitValue(cells[id].value);
      initCellDecoration(this.cells[row][col], cells[id].decoration);
      // this.cells[row][col].setInitDecoration(cells[id].decoration);
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
    this.selector.curCell.setValue(value);
  }

  eFormulaEnter() {
    this.selector.move.down();
  }

  resize(resizeHandler, orientation) {
    resizeHandler().then((data) => {
      console.log(data);
      this.store.dispatch({type: atype.TABLE_RESIZE, orientation, data});
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
    this.selector.curCell.setValueFromElement();
  }

  htmlInitial() {
    console.log(this.cells);
    this.$root.append(getTemplate(this.cells, this.rows, this.cols));
    this.$root.append(this.cssRules.styleElement);
  }

  toHtml() {
    console.log(this.rows, this.cols);
    this.$root.html = getPureHtml();
  }
}
