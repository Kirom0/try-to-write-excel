import {eo} from '@core/ExtendedObj';

export const stateToCss = {};

export const controllersConfiguration = {
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
  fontFamily: {
    type: 'array',
    default: 'Robot',
    value: [
      {
        name: 'Robot',
        html: 'Robot',
        css: {
          ['font-family']: 'Robot',
        },
      },
      {
        name: 'Times',
        html: 'Times New Roman',
        css: {
          ['font-family']: '"Times New Roman", Times, serif',
        },
      },
      {
        name: 'Arial',
        html: 'Arial',
        css: {
          ['font-family']: 'Arial, Helvetica, sans-serif',
        },
      },
      {
        name: 'Palatino',
        html: 'Palatino Linotype',
        css: {
          ['font-family']: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
        },
      },
      {
        name: 'Comic',
        html: 'Comic Sans MS',
        css: {
          ['font-family']: '"Comic Sans MS", cursive, sans-serif',
        },
      },
      {
        name: 'Lucida',
        html: 'Lucida Console',
        css: {
          ['font-family']: '"Lucida Console", Monaco, monospace',
        },
      },
    ],
  },
  fontSize: {
    type: 'array',
    default: '12',
    value: [
      {
        name: '12',
        html: '12px',
        css: {
          ['font-size']: '12px',
        },
      },
      {
        name: '16',
        html: '16px',
        css: {
          ['font-size']: '16px',
        },
      },
      {
        name: '18',
        html: '18px',
        css: {
          ['font-size']: '18px',
        },
      },
      {
        name: '22',
        html: '22px',
        css: {
          ['font-size']: '22px',
        },
      },
    ],
  },
};

function applyConfiguration() {
  const setValue = (k, v) => {
    stateToCss[k] = v;
  };
  eo(controllersConfiguration).forEach((propName, propConfig) => {
    switch (propConfig.type) {
      case 'array':
        {
          const values = {};
          propConfig.value.forEach((v) => {
            values[v.name] = v.css;
          });
          setValue(propName, (value) => values[value]);
        }
        break;
      case 'boolean':
        setValue(propName, (value) => propConfig.value[value]);
        break;
      case 'calculated':
        setValue(propName, propConfig.calc);
        break;
    }
  });
  console.log('stateToCss: ', stateToCss);
}

applyConfiguration();
