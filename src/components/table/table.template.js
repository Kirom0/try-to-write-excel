import {$} from '@core/dom';
import {range} from '@core/utils';

export function getTemplate(rows, columns) {
  return createHeadline({
    postfix: '__main',
    childClass: 'column',
    childValues: range(columns).map(getLitterByNumber),
  }) +
    range(rows).map(
        (row) => createRow({
          infoValue: row + 1,
          childClass: 'cell',
          childValues: range(columns).map((item) => ''),
        })
    ).join('') +
    $.create('div', {
      class: 'rows__resizer',
      'data-resizer': 'rows',
    }).html;
}

function createRow(options) {
  const {
    infoValue = '',
    postfix = '',
    childClass = '',
    childValues = [],
  } = options;

  const $el = $.create('div', {class: 'row' + postfix});
  $el.append(
      $.create('div', {
        class: childClass + '__info',
        'data-type': 'resizable',
        'data-row-title': infoValue,
      }).setHtml(infoValue +
        $.create('div', {
          class: 'row__resizer',
          'data-resizer': 'row',
        }).html
      )
  );
  $el.append(
      $.create('div', {class: childClass + 's'})
          .setHtml(
              childValues.map((child, index)=>
                $.create('div', {
                  class: childClass,
                  contenteditable: '' + (childClass === 'ceil'),
                  'data-column-title': getLitterByNumber(index),
                  'data-row-title': infoValue,
                })
                    .setHtml(child).html
              ).join('')
          )
  );

  return $el.html;
}

function createHeadline(options) {
  const {
    infoValue = '',
    postfix = '',
    childClass = '',
    childValues = [],
  } = options;

  const $el = $.create('div', {class: 'row' + postfix});
  $el.append(
      $.create('div', {class: childClass + '__info'})
          .setHtml(infoValue)
  );
  const resizer = $.create('div', {
    class: childClass + '__resizer',
    'data-resizer': 'column',
  }).html;
  $el.append(
      $.create('div', {class: childClass + 's'})
          .setHtml(
              childValues.map((child, index)=>
                $.create('div', {
                  class: childClass,
                  'data-type': 'resizable',
                  'data-column-title': child,
                })
                    .setHtml(child + resizer).html
              ).join('') +
              $.create('div', {
                class: 'columns__resizer',
                'data-resizer': 'columns',
              }).html
          )
  );

  return $el.html;
}

function getLitterByNumber(number) {
  const A = 65;
  const Z = 90;
  const diff = Z - A + 1;
  let reversedResult = '';
  while (number >= diff) {
    reversedResult += String.fromCharCode(number % diff + A);
    number = Math.floor(number / diff) - 1;
  }
  reversedResult += String.fromCharCode(number + A);
  let result = '';
  for (let i = 0; i < reversedResult.length; i++) {
    result += reversedResult[reversedResult.length - i - 1];
  }
  return result;
}
