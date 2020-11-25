import {$} from '@core/dom';

export class Selector {
  constructor(cells) {
    this.selected = [];
    this.cells = cells;
  }

  select(row, col) {
    this.clear();
    const cell = this.cells[row][col];
    cell.select();
    this.selected.push(cell);
  }

  selectGroup() {

  }

  clear() {
    this.selected.forEach((cell) => {
      cell.unselect();
    });
    this.selected = [];
  }
}

export function selectorHandler(table, event) {
  const $target = $(event.target);
  const beginRow = $target.dataset['row'];
  const beginCol = $target.dataset['column'];
  console.log(beginRow, beginCol);
  table.selector.select(beginRow, beginCol);

  console.log(event, $target.getBoundingClientRect());

  // eslint-disable-next-line no-unused-vars
  const mousemove = (event) => {
    console.log(event.target.dataset);
  };
  // table.addGlobalListener('mousemove', mousemove);
}

export function shouldSelect(event) {
  return ($(event.target).dataset['type'] === 'cell');
}
