export class TableCell {
  constructor(row, col, $el) {
    this.row = row;
    this.col = col;
    this.value = '';
    this.$el = $el;
  }

  get elem() {
    return this.$el;
  }

  select() {
    this.$el.classList.add('selected');
  }

  unselect() {
    this.$el.classList.remove('selected');
  }
}
