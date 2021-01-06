import {ExcelComponent} from '@core/ExcelComponent';
import {Button} from '@/components/toolbar/toolbar.button';
import {ButtonGroup} from '@/components/toolbar/toolbar.buttonGroup';
import {$} from '@core/dom';
import {ToggleButton} from '@/components/toolbar/toolbar.toggleButton';
import {atype, createAction} from '@/redux/actions';
import {CSSRules} from '@core/css';

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
      this.state = {
        ...this.state,
        ...state,
      };
      console.log('changeEmit: ', this.state);
      this.store.dispatch(createAction(atype.TOOLBAR_STATE_CHANGED, this.state));
      this.refreshCSSRules(this.state);
    };
    const align = new ButtonGroup(
        [
          new Button('alignLeft', 'format_align_left'),
          new Button('alignCenter', 'format_align_center'),
          new Button('alignRight', 'format_align_right'),
        ],
        {
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
          necessaryMeta: necessaryMetaCreator('bold'),
          cssRule: 'font-weight',
          cssValues: ['normal', 'bold'],
          changeEmitter,
        }
    );
    const italic = new ToggleButton(
        new Button('italic', 'format_italic'),
        {
          necessaryMeta: necessaryMetaCreator('italic'),
          cssRule: 'font-style',
          cssValues: ['normal', 'italic'],
          changeEmitter,
        }
    );
    const underline = new ToggleButton(
        new Button('underline', 'format_underline'),
        {
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

  refreshCSSRules(state) {
    let rules = {};
    Object.keys(state).forEach((key) => {
      rules = {
        ...rules,
        ...this.controllers[key].getCSSRules(),
      };
    });
    const selector = '[data-id="0:0"]';
    this.cssRules.addRules({
      [selector]: rules,
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
