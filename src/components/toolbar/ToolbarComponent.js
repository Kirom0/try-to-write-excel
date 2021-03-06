import {Component} from '@core/Component';
import {ButtonGroup} from '@/components/toolbar/toolbar.buttonGroup';
import {$} from '@core/dom';
import {ToggleButton} from '@/components/toolbar/toolbar.toggleButton';
import {atype, createAction} from '@/redux/actions';
import {etypes} from '@core/Emitter';
import {eo} from '@core/ExtendedObj';
import {
  stateToCss,
  controllersConfiguration,
} from '@/components/toolbar/toolbar.controller.config';
import {Selector} from '@/components/toolbar/toolbar.selector';

export class ToolbarComponent extends Component {
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
    const fontFamily = new Selector({
      name: 'fontFamily',
      metaData: metaDataCreator('fontFamily'),
      changeEmitter,
    });
    const fontSize = new Selector({
      name: 'fontSize',
      metaData: metaDataCreator('fontSize'),
      changeEmitter,
    });

    this.controllers = {align, bold, italic, underline, fontFamily, fontSize};
    this.orderOfTheControllers = [align, bold, italic, underline, fontFamily, fontSize];

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
    const $target = $(event.target);
    const meta = $target.dataset['controller'];
    if (meta) {
      this.controllers[meta].onClick(event);
    }
  }
}


function metaDataCreator(value) {
  return {'data-controller': value};
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
        eo(state).map((k, v) => stateToCss[k](v))
    );
    eo(context.state).forEach((k, v) => {
      if (v === controllersConfiguration[k].default) {
        delete context.state[k];
      }
    });

    context.store.dispatch(
        createAction(atype.TOOLBAR_STATE_CHANGED, {
          cellId: context._tableCell.id,
          state: context.state,
        })
    );
  }
}
