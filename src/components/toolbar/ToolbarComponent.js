import {ExcelComponent} from '@core/ExcelComponent';
import {ButtonGroup} from '@/components/toolbar/toolbar.buttonGroup';
import {$} from '@core/dom';
import {ToggleButton} from '@/components/toolbar/toolbar.toggleButton';
import {atype, createAction} from '@/redux/actions';
import {CSSRules} from '@core/css';
import {etypes} from '@core/Emitter';
import {eo} from '@core/ExtendedObj';
import {
  stateToCss,
  stateToCssConfiguration,
} from '@/components/toolbar/toolbar.state&css';

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
    this.cssRules = new CSSRules();
    this.state = {};

    const changeEmitter = (state) => _changeEmitter(this, state);
    const align = new ButtonGroup({
      name: 'align',
      metaData: metaDataCreator('align'),
      changeEmitter,
    });
    const bold = new ToggleButton({
      name: 'bold',
      metaData: metaDataCreator('bold'),
      changeEmitter,
    });
    const italic = new ToggleButton({
      name: 'italic',
      metaData: metaDataCreator('italic'),
      changeEmitter,
    });
    const underline = new ToggleButton({
      name: 'underline',
      metaData: metaDataCreator('underline'),
      changeEmitter,
    });

    this.controllers = {align, bold, italic, underline};
    this.orderOfTheControllers = [align, bold, italic, underline];

    this.setTargetCell = this.setTargetCell.bind(this);
    this.$on(etypes.TABLE_CURRENTCELL_SWITCHED, this.setTargetCell);
  }

  setTargetCell(tableCell) {
    this._tableCell = tableCell;
    this.state = {};

    const store = this.store.get();
    const decoration = (store.cells[tableCell.id] || {decoration: {}}).decoration;
    eo(this.controllers).forEach((name, controller) => {
      if (Object.hasOwnProperty.call(decoration, name)) {
        controller.reset(decoration[name]);
        this.state[name] = decoration[name];
      } else {
        controller.reset();
      }
    });
  }

  get tableCell() {
    return this._tableCell;
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


function metaDataCreator(value) {
  return {'data-button': value};
}

function _changeEmitter(context, state) {
  let areChanges = false;
  for (const key in state) {
    if (Object.hasOwnProperty.call(state, key)) {
      if (context.state[key] !== state[key]) {
        areChanges = true;
        break;
      }
    }
  }

  if (areChanges) {
    context.state = {
      ...context.state,
      ...state,
    };
    context.tableCell.setDecoration(
        eo(state).map((k, v) => stateToCss[k][v])
    );
    eo(context.state).forEach((k, v) => {
      if (v === stateToCssConfiguration[k].default) {
        delete context.state[k];
      }
    });

    console.log('changeEmit: ', context.state);
    context.store.dispatch(
        createAction(atype.TOOLBAR_STATE_CHANGED, {
          cellId: context._tableCell.id,
          state: context.state,
        })
    );
  }
}
