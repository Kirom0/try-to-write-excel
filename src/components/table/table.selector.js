// eslint-disable-next-line no-unused-vars
export class Selector {
  constructor(cells) {
    this.selected = [];
    this.cells = cells;
  }

  select(row, col) {
    this.selected.forEach((cell) => {
      cell.unselect();
    });
    const cell = this.cells[row][col];
    cell.select();
    this.selected = [cell];
  }

  selectGroup() {

  }
}
