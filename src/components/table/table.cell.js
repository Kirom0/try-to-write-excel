import {cellInitial} from '@/components/table/table.template';
import {toId} from '@/components/table/table.functions';
import {defaultCellDecoration} from '@/redux/defaultCellDecoration';
import {atype, createAction} from '@/redux/actions';

export class TableCell {
  constructor(table, row, col) {
    this.table = table;
    this.row = row;
    this.col = col;

    this.prepare();
  }

  prepare() {
    this._value = '';
    this.id = toId(this.row, this.col);
    this.decoration = defaultCellDecoration;
  }

  setInitValue(value) {
    this._value = value;
  }

  setInitDecoration(decorations) {
    this.decoration = {
      ...this.decoration,
      ...decorations,
    };
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
          createAction(atype.CELL_CHANGED, {
            key: this.id,
            value: this._value,
          })
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

  setDecoration(decorations) {
    const isCurrent = this.table.isCellCurrent(this);
    Object.keys(decorations).forEach((key) => {
      this.decoration[key] = decorations[key];
    });
    if (isCurrent) {
      this.table.$emit('cell:decoration:changed', {
        id: this.id,
        decorations,
      });
    }
    this.table.dispatch({
      type: '',
      data: {
        [this.id]: decorations,
      },
    });
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
