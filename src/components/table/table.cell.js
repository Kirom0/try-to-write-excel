import {cellInitial} from '@/components/table/table.template';
import {toId} from '@/components/table/table.functions';
import {atype, createAction} from '@/redux/actions';
import {etypes} from '@core/Emitter';

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
    this.decoration = {};
    this._decorationInited = false;
  }

  setInitValue(value) {
    this._value = value;
  }

  setInitDecoration(decorations) {
    if (this._decorationInited) {
      throw new Error('setInitDecoration method already was called');
    }
    this.decoration = decorations;
    this._decorationInited = true;
  }

  init() {
    this.$el = cellInitial(this.row, this.col);
    this.$el.nativeEl.innerText = this._value;

    const applyCSS = (function(styles) {
      this.table.cssRules.addRules({
        [`[data-id="${this.id}"]`]: styles,
      });
    }).bind(this);

    this._decorationInited = true;
    applyCSS(this.decoration);
    this.decoration = new Proxy(this.decoration, {
      set(target, prop, value) {
        applyCSS({
          [prop]: value,
        });
        target[prop] = value;
        return true;
      },
    });
  }

  setValueFromElement() {
    const value = this.$el.nativeEl.innerText;
    if (this._value !== value) {
      this._value = this.$el.nativeEl.innerText;
      this.dispatchValueChanges();
    }
  }

  dispatchValueChanges() {
    if (this.table.isCellCurrent(this)) {
      this.table.$emit(etypes.TABLE_CURRENTCELL_VALUE_CHANGED, this._value);
    }
    this.table.dispatch(
        createAction(atype.CELL_CHANGED, {
          key: this.id,
          value: this._value,
        })
    );
  }

  setValue(value) {
    this._value = value;
    this.$el.nativeEl.innerText = value;
    this.dispatchValueChanges();
  }

  setDecoration(decorations) {
    Object.keys(decorations).forEach((key) => {
      this.decoration[key] = decorations[key];
    });

    const isCurrent = this.table.isCellCurrent(this);
    if (isCurrent) {
      this.table.$emit(etypes.TABLE_CURRENTCELL_DECORATION_CHANGED, {
        id: this.id,
        decorations,
      });
    }
    this.table.dispatch(
        createAction(
            atype.CELL_DECORATION_CHANGED,
            {
              [this.id]: decorations,
            }
        )
    );
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
