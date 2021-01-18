import {Controller} from '@/components/toolbar/toolbar.controller';
import {Button} from '@/components/toolbar/toolbar.button';
import {stateToCssConfiguration} from '@/components/toolbar/toolbar.state&css';

export class ToggleButton extends Controller {
  constructor(options) {
    super(options);
    const {metaData} = options;
    this.metaData = metaData;

    const btnValue = stateToCssConfiguration[this.name]['material-icon'];
    this.button = new Button(this.name, btnValue);
  }

  init() {
    this.button.init(
        {
          type: 'checkbox',
          ...this.metaData,
        },
        (value) => {
          this.changeState(this.button.name, value);
        }
    );
  }

  get$() {
    return this.button.$elem;
  }

  onClick(event) {
    this.button.toggle();
  }

  reset(value) {
    if (value === undefined) {
      value = this.defaultValue;
    }
    this.button.reset(value);
  }
}
