import {cellInitial} from '@/components/table/table.template';

export class TableCell {
  constructor(table, row, col) {
    this.table = table;
    this.row = row;
    this.col = col;

    this.prepare();

    Object.defineProperties(this, {
      value: {
        set(value) {
          this.$el.nativeEl.innerText = value;
          this._value = value;
          this.table.emitter.emit('table:cell:changed', value);
        },
        get() {
          return this._value;
        },
      },
    });
  }

  prepare() {
    this._value = '';
  }

  init() {
    this.$el = cellInitial(this.row, this.col);
  }

  updateValue() {
    const value = this.$el.nativeEl.innerText;
    if (this._value !== value) {
      this._value = this.$el.nativeEl.innerText;
      this.table.emitter.emit('table:cell:changed', this._value);
    }
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
