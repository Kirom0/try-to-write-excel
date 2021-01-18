import {ExcelComponent} from '@core/ExcelComponent';
import {Button} from '@/components/toolbar/toolbar.button';
import {ButtonGroup} from '@/components/toolbar/toolbar.buttonGroup';
import {$} from '@core/dom';
import {ToggleButton} from '@/components/toolbar/toolbar.toggleButton';
import {atype, createAction} from '@/redux/actions';
import {CSSRules} from '@core/css';
import {etypes} from '@core/Emitter';
import {eo} from '@core/ExtendedObj';
import {stateToCssConfiguration} from '@/components/toolbar/toolbar.state&css';

export class ToolbarComponent extends ExcelComponent {
  static className = ['excel__toolbar', 'box-shadow'];
  constructor($root, options = {}) {
    super($root, {
      name: 'Toolbar',
      listeners: ['change'],
      ...options,
    });

    this.prepare();
  }

  prepare() {
    this.state = {};
    const changeEmitter = (state) => {
      let areChanges = false;
      for (const key in state) {
        if (Object.hasOwnProperty.call(state, key)) {
          if (this.state[key] !== state[key]) {
            areChanges = true;
            break;
          }
        }
      }

      if (areChanges) {
        this.state = {
          ...this.state,
          ...state,
        };
        this.tableCell.setDecoration(
            eo(state).map((k) => this.controllers[k].getCSSRules())
        );
        eo(this.state).forEach((k, v) => {
          if (v === stateToCssConfiguration[k].default) {
            delete this.state[k];
          }
        });

        console.log('changeEmit: ', this.state);
        this.store.dispatch(
            createAction(atype.TOOLBAR_STATE_CHANGED, {
              cellId: this._tableCell.id,
              state: this.state,
            })
        );
      }
    };
    const align = new ButtonGroup(
        [
          new Button('alignLeft', 'format_align_left'),
          new Button('alignCenter', 'format_align_center'),
          new Button('alignRight', 'format_align_right'),
        ],
        {
          name: 'align',
          unicButtonGroupName: 'align',
          cssRule: 'text-align',
          cssValues: {
            'alignLeft': 'left',
            'alignCenter': 'center',
            'alignRight': 'right',
          },
          necessaryMeta: necessaryMetaCreator('align'),
          changeEmitter,
        },
    );
    const bold = new ToggleButton(
        new Button('bold', 'format_bold'),
        {
          name: 'bold',
          necessaryMeta: necessaryMetaCreator('bold'),
          cssRule: 'font-weight',
          cssValues: ['normal', 'bold'],
          changeEmitter,
        }
    );
    const italic = new ToggleButton(
        new Button('italic', 'format_italic'),
        {
          name: 'italic',
          necessaryMeta: necessaryMetaCreator('italic'),
          cssRule: 'font-style',
          cssValues: ['normal', 'italic'],
          changeEmitter,
        }
    );
    const underline = new ToggleButton(
        new Button('underline', 'format_underline'),
        {
          name: 'underline',
          necessaryMeta: necessaryMetaCreator('underline'),
          cssRule: 'text-decoration',
          cssValues: ['none', 'underline'],
          changeEmitter,
        }
    );

    this.controllers = {
      align,
      bold,
      italic,
      underline,
    };
    this.orderOfTheControllers = [
      align,
      bold,
      italic,
      underline,
    ];
    this.cssRules = new CSSRules();

    this.setTargetCell = this.setTargetCell.bind(this);
    this.$on(etypes.TABLE_CURRENTCELL_SWITCHED, this.setTargetCell);
  }

  setTargetCell(tableCell) {
    this._tableCell = tableCell;
    this.state = {};

    const store = this.store.get();
    const decoration = (store.cells[tableCell.id] || {decoration: {}}).decoration;
    for (const key in decoration) {
      if (Object.hasOwnProperty.call(decoration, key)) {
        this.controllers[key].acceptValue(decoration[key]);
      }
    }
    eo(this.controllers).forEach((name, controller) => {
      if (Object.hasOwnProperty.call(decoration, name)) {
        controller.acceptValue(decoration[name]);
      } else {
        controller.setDefaultValue();
      }
    });
  }

  get tableCell() {
    return this._tableCell;
  }

  changerState(state) {
    this.state = {
      ...this.state,
      ...state,
    };
    console.log(this.state);
  }

  init() {
    // super.init();
    this.initListeners();
    this.htmlInitial();
  }

  htmlInitial() {
    this.orderOfTheControllers.forEach((controller) => {
      controller.init();
      this.$root.append(controller.get$());
    });
  }

  onChange(event) {
    console.log(event.target);
    const $target = $(event.target);
    const meta = $target.dataset['button'];
    if (meta) {
      this.controllers[meta].onClick(event);
    }
  }

  toHtml() {
    return `
  <div class="button__container">
    <input id="alignLeft" type="radio" name="align" value="alignLeft" checked>
    <label for="alignLeft">
      <i class="material-icons button">format_align_left</i>
    </label>
  </div>

  <div class="button__container">
    <input id="alignCenter" type="radio" name="align" value="alignCenter">
    <label for="alignCenter">
      <i class="material-icons button">format_align_center</i>
    </label>
  </div>

  <div class="button__container">
    <input id="alignRight" type="radio" name="align" value="alignRight">
    <label for="alignRight">
      <i class="material-icons button">format_align_right</i>
    </label>
  </div>

  <div class="button__container">
    <input id="bold" type="checkbox" value="bold">
    <label for="bold">
      <i class="material-icons button">format_bold</i>
    </label>
  </div>

  <div class="button__container">
    <input id="italic" type="checkbox" value="italic">
    <label for="italic">
      <i class="material-icons button">format_italic</i>
    </label>
  </div>

  <div class="button__container">
    <input id="underline" type="checkbox" value="underline">
    <label for="underline">
      <i class="material-icons button">format_underlined</i>
    </label>
  </div>
  
  <div class="button__container">
    <select>
      <option value="12">12px</option>
      <option value="14">14px</option>
      <option value="16">16px</option>
      <option value="18">18px</option>
    </select>
</div>
`;
    /* <i class="material-icons button">format_align_left</i>
      <i class="material-icons button">format_align_center</i>
      <i class="material-icons button">format_align_right</i>
      <i class="material-icons button">format_bold</i>
      <i class="material-icons button">format_italic</i>
      <i class="material-icons button">format_underlined</i>
    `; */
  }
}


function necessaryMetaCreator(value) {
  return {'data-button': value};
}
