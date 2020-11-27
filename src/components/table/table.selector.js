import {$} from '@core/dom';
import {parseId} from '@/components/table/table.functions';

export class Selector {
  constructor(table, rowSizes, colSizes) {
    this.table = table;
    this.rowSizes = rowSizes;
    this.colSizes = colSizes;

    this.prepare();
  }

  prepare() {
    this.selected = [];
    this.groupSelector = new GroupSelector(this.rowSizes, this.colSizes);
  }

  init($table, cells) {
    this.cells = cells;
    this.groupSelector.init($table);
    this.select(0, 0);
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

  handler(event) {
    const $target = $(event.target);
    const [beginRow, beginCol] =parseId($target.dataset.id);
    let lastTargetId = $target.dataset['coordinates'];
    let [lastRow, lastCol] = [beginRow, beginCol];
    console.log(beginRow, beginCol);
    this.table.selector.select(beginRow, beginCol);

    console.log(event, $target.getBoundingClientRect());

    const onmousemove = (function(event) {
      const $target = $(event.target);
      if ($target.dataset['type'] === 'cell') {
        if ($target.dataset.id !== lastTargetId) {
          lastTargetId = $target.dataset.id;
          ([lastRow, lastCol] = parseId(lastTargetId));
          this.groupSelector.setView(beginRow, beginCol, lastRow, lastCol);
        }
      }
    }).bind(this);

    const onmouseup = (function(event) {
      const $target = $(event.target);
      if ($target.dataset['type'] === 'cell') {
        ([lastRow, lastCol] = parseId($target.dataset.id));
      }
      this.selectGroup(beginRow, beginCol, lastRow, lastCol);
      // this.groupSelector.disable();
      this.table.eraseGlobalListener('mousemove');
      this.table.eraseGlobalListener('mouseup');
    }).bind(this);

    this.table.addGlobalListener('mousemove', onmousemove);
    this.table.addGlobalListener('mouseup', onmouseup);
  }
}

export function shouldSelect(event) {
  return ($(event.target).dataset['type'] === 'cell');
}

class GroupSelector {
  constructor(rowSizes, colSizes) {
    this.rowSizes = rowSizes;
    this.colSizes = colSizes;
  }

  init($table) {
    this.$selector = $.create('div', {class: 'groupSelector'});
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
