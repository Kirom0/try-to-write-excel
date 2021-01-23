import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom';
import {atype, createAction} from '@/redux/actions';

export class HeaderComponent extends ExcelComponent {
  static className = ['excel__header', 'box-shadow'];
  constructor($root, options = {}) {
    super($root, {
      name: 'Header',
      listeners: ['input'],
      ...options,
    });

    Object.defineProperties(this, {
      tableName: {
        set(value) {
          const isChange = this._tableName !== value;
          this._tableName = value;
          if (isChange) {
            this.$header.nativeEl.value = value;
            this.store.dispatch(createAction(atype.HEADER_CHANGED, this.tableName));
          }
        },
        get() {
          return this._tableName;
        },
      },
    });

    this.prepare();
  }

  prepare() {
    this._tableName = this.store.get().header;
  }

  init() {
    this.htmlInitial();
    this.initListeners();
  }

  onInput(event) {
    console.log('hello from header');
    const $target = $(event.target);
    if ($target.dataset['type'] === 'header') {
      this.tableName = $target.value;
    }
  }

  htmlInitial() {
    this.$header = $.create('input', {
      class: 'input',
      type: 'text',
      ['data-type']: 'header',
      value: this.tableName,
    });
    this.$delete = $.create('i', {
      class: 'material-icons button',
    }).setHtml('delete_forever');
    this.$close = $.create('i', {
      class: 'material-icons button',
    }).setHtml('close');

    this.$root.append(this.$header);
    this.$root.append(
        $.create('div', {class: 'icons'})
            .append(this.$delete)
            .append(this.$close)
    );
  }

  toHtml() {
    return `
    <input class="input" type="text" data-type="header" value="${this.tableName}">
    <div class="icons">
      <i class="material-icons button">delete_forever</i>
      <i class="material-icons button">close</i>
    </div>
    `;
  }
}
