import {eo} from '@core/ExtendedObj';

export const stateToCss = {
  /* align: {
    alignLeft: {
      'text-align': 'left',
    },
    alignCenter: {
      'text-align': 'center',
    },
    alignRight: {
      'text-align': 'right',
    },
  },
  bold: {
    [true]: {
      'text-weight': 'bold',
    },
    [false]: {
      'text-weight': 'normal',
    },
  },
  italic: {
    [true]: {
      'font-style': 'italic',
    },
    [false]: {
      'font-style': 'normal',
    },
  },
  underline: {
    [true]: {
      'text-decoration': 'underline',
    },
    [false]: {
      'text-decoration': 'none',
    },
  }, */
};

export const stateToCssConfiguration = {
  align: {
    type: 'array',
    default: 'alignLeft',
    value: [
      {
        name: 'alignLeft',
        css: {
          'text-align': 'left',
        },
        ['material-icon']: 'format_align_left',
      },
      {
        name: 'alignCenter',
        css: {
          'text-align': 'center',
        },
        ['material-icon']: 'format_align_center',
      },
      {
        name: 'alignRight',
        css: {
          'text-align': 'right',
        },
        ['material-icon']: 'format_align_right',
      },
    ],
  },
  bold: {
    type: 'boolean',
    default: false,
    value: {
      [true]: {
        'font-weight': 'bold',
      },
      [false]: {
        'font-weight': 'normal',
      },
    },
    ['material-icon']: 'format_bold',
  },
  italic: {
    type: 'boolean',
    default: false,
    value: {
      [true]: {
        'font-style': 'italic',
      },
      [false]: {
        'font-style': 'normal',
      },
    },
    ['material-icon']: 'format_italic',
  },
  underline: {
    type: 'boolean',
    default: false,
    value: {
      [true]: {
        'text-decoration': 'underline',
      },
      [false]: {
        'text-decoration': 'none',
      },
    },
    ['material-icon']: 'format_underline',
  },
};

function applyConfiguration() {
  const setValue = (k, v) => {
    stateToCss[k] = v;
  };
  eo(stateToCssConfiguration).forEach((k, v) => {
    switch (v.type) {
      case 'array':
        {
          const values = {};
          v.value.forEach((v) => {
            values[v.name] = v.css;
          });
          setValue(k, values);
        }
        break;
      case 'boolean':
        setValue(k, v.value);
        break;
    }
  });
  console.log('stateToCss: ', stateToCss);
}

applyConfiguration();
