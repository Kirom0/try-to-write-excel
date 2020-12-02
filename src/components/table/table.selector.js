import {$} from '@core/dom';
import {parseId} from '@/components/table/table.functions';

export class Selector {
  constructor(table, rowSizes, colSizes) {
    this.table = table;
    this.rowSizes = rowSizes;
    this.colSizes = colSizes;

    this.prepare();

    Object.defineProperties(this, {
      curRow: {
        set(value) {
          this._curRow = value;
          this._curId =
            '' + value + this._curId.slice(this._curId.indexOf(':'));
          this.$emit('table:selector:switched', this.curCell.value);
        },
        get() {
          return this._curRow;
        },
      },
      curCol: {
        set(value) {
          this._curCol = value;
          this._curId =
            this._curId.substr(0, this._curId.indexOf(':') + 1) + value;
          this.$emit('table:selector:switched', this.curCell.value);
        },
        get() {
          return this._curCol;
        },
      },
      curId: {
        set(value) {
          [this._curRow, this._curCol] = parseId(value);
          this._curId = value;
          this.$emit('table:selector:switched', this.curCell.value);
        },
        get() {
          return this._curId;
        },
      },
    });
  }

  prepare() {
    this.selected = [];
    this.groupSelector = new GroupSelector(this.rowSizes, this.colSizes);
    this.$emit = this.table.emitter.emit;
  }

  init($table, cells) {
    this.cells = cells;
    this.$table = $table;
    this.groupSelector.init($table);

    this.tableRect = $table.getBoundingClientRect();

    this.curId = '0:0';
    this.focus();
  }

  get curCell() {
    return this.cells[this.curRow][this.curCol];
  }

  select(row, col) {
    this.clear();
    const cell = this.cells[row][col];
    cell.select();
    this.selected.push(cell);
  }

  selectGroup(bRow, bCol, eRow, eCol) {
    this.clear();

    const NWRow = bRow < eRow ? bRow : eRow; // North-West
    const NWCol = bCol < eCol ? bCol : eCol;
    const SERow = bRow > eRow ? bRow : eRow; // South-East
    const SECol = bCol > eCol ? bCol : eCol;
    for (let row = NWRow; row <= SERow; row++) {
      for (let col = NWCol; col <= SECol; col++) {
        const cell = this.cells[row][col];
        cell.select();
        this.selected.push(cell);
      }
    }
  }

  clear() {
    this.selected.forEach((cell) => {
      cell.unselect();
    });
    this.selected = [];
  }

  focus() {
    this.clear();
    this.select(this.curRow, this.curCol);
    this.cells[this.curRow][this.curCol].elem.nativeEl.focus({preventScroll: true});
  }

  mouseDownHandler(event) {
    const $target = $(event.target);
    let lastTargetId = $target.dataset.id;

    if (event.shiftKey) {
      const [bRow, bCol] = parseId(lastTargetId);
      const [row, col] = parseId(this.curId);
      this.selectGroup(bRow, bCol, row, col);
      return;
    }
    const [beginRow, beginCol] = parseId(lastTargetId);
    let [lastRow, lastCol] = [beginRow, beginCol];

    this.table.selector.select(beginRow, beginCol);
    this.curId = lastTargetId;

    const reloadLastId = (function(event) {
      const $target = $(event.target);
      if ($target.dataset['type'] === GroupSelector.DATATYPE) {
        const X = (event.clientX - this.tableRect.left) + this.$table.nativeEl.scrollLeft;
        const Y = (event.clientY - this.tableRect.top) + this.$table.nativeEl.scrollTop;
        ([lastRow, lastCol] = [this.rowSizes.find(Y), this.colSizes.find(X)]);
        lastTargetId = `${lastRow}:${lastCol}`;
        return true;
      } else
      if ($target.dataset['type'] === 'cell') {
        if ($target.dataset.id !== lastTargetId) {
          lastTargetId = $target.dataset.id;
          ([lastRow, lastCol] = parseId(lastTargetId));
          return true;
        }
      }
      return false;
    }).bind(this);

    const onmousemove = (function(event) {
      if (reloadLastId(event)) {
        this.groupSelector.setView(beginRow, beginCol, lastRow, lastCol);
      }
    }).bind(this);

    const onmouseup = (function(event) {
      reloadLastId(event);
      this.selectGroup(beginRow, beginCol, lastRow, lastCol);
      this.groupSelector.disable();

      this.table.eraseGlobalListener('mousemove');
      this.table.eraseGlobalListener('mouseup');
    }).bind(this);

    this.table.addGlobalListener('mousemove', onmousemove);
    this.table.addGlobalListener('mouseup', onmouseup);
  }

  static keyNeedReact = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab'];

  keyDownHandler(event) {
    console.log(event);
    const {shiftKey, code} = event;
    if (!shiftKey && Selector.keyNeedReact.includes(code)) {
      let changed = false;
      switch (code) {
        case 'ArrowDown':
        case 'Enter':
          changed = this.move.down();
          break;
        case 'ArrowUp':
          changed = this.move.up();
          break;
        case 'ArrowLeft':
          changed = this.move.left();
          break;
        case 'ArrowRight':
        case 'Tab':
          changed = this.move.right();
          break;
      }
      if (changed) {
        event.preventDefault();
      }
    }
  }

  get move() {
    return {
      up: () => {
        if (this.curRow - 1 >= 0) {
          this.curRow -= 1;
          this.focus();
          return true;
        }
        return false;
      },
      down: () => {
        if (this.curRow + 1 < this.rowSizes.length) {
          this.curRow += 1;
          this.focus();
          return true;
        }
        return false;
      },
      left: () => {
        if (this.curCol - 1 >= 0) {
          this.curCol -= 1;
          this.focus();
          return true;
        }
        return false;
      },
      right: () => {
        if (this.curCol + 1 < this.colSizes.length) {
          this.curCol += 1;
          this.focus();
          return true;
        }
        return false;
      },
    };
  }
}

export function shouldSelect(event) {
  return ($(event.target).dataset['type'] === 'cell');
}

class GroupSelector {
  static DATATYPE = 'groupSelector';
  constructor(rowSizes, colSizes) {
    this.rowSizes = rowSizes;
    this.colSizes = colSizes;
  }

  init($table) {
    this.$selector = $.create('div', {
      class: 'groupSelector',
      'data-type': GroupSelector.DATATYPE,
    });
    $table.append(this.$selector);
  }

  setView(row1, col1, row2, col2) {
    const upRow = row1 < row2 ? row1 : row2; // North-West
    const leftCol = col1 < col2 ? col1 : col2;
    const downRow = row1 > row2 ? row1 : row2; // South-East
    const rightCol = col1 > col2 ? col1 : col2;

    this.$selector.style.display = 'block';
    this.$selector.style.width =
      this.colSizes.sumBefore(rightCol + 1) - this.colSizes.sumBefore(leftCol) + 'px';
    this.$selector.style.height =
      this.rowSizes.sumBefore(downRow + 1) - this.rowSizes.sumBefore(upRow) + 'px';
    this.$selector.style.left =
      this.colSizes.sumBefore(leftCol) + 'px';
    this.$selector.style.top =
      this.rowSizes.sumBefore(upRow) + 'px';
  }

  disable() {
    this.$selector.style.display = 'none';
  }
}
