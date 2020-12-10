import {cellInitial} from '@/components/table/table.template';
import {toId} from '@/components/table/table.functions';

export class TableCell {
  constructor(table, row, col) {
    this.table = table;
    this.row = row;
    this.col = col;

    this.prepare();
  }

  prepare() {
    this._value = '';
  }

  setInitValue(value) {
    this._value = value;
  }

  init() {
    this.$el = cellInitial(this.row, this.col);
    this.$el.nativeEl.innerText = this._value;
  }

  updateValue(needDispatchToSubs = true) {
    const value = this.$el.nativeEl.innerText;
    if (this._value !== value) {
      this._value = this.$el.nativeEl.innerText;
      this.dispatchChanges(needDispatchToSubs);
    }
  }

  dispatchChanges(needDispatchToSubs) {
    if (needDispatchToSubs) {
      if (this.table.isCellCurrent(this)) {
        this.table.$emit('table:currentCell:value', this._value);
      }
      this.table.dispatch(
          {
            type: 'CELL_CHANGED',
            data: {
              [toId(this.row, this.col)]: this._value,
            },
          }
      );
    }
  }

  setValue(value, needDispatchToSubs = true) {
    this._value = value;
    this.$el.nativeEl.innerText = value;
    this.dispatchChanges(needDispatchToSubs);
  }

  get value() {
    return this._value;
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
