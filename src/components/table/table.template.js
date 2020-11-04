import {$} from '@core/dom';
import {range} from '@core/utils';

export function getTemplate(rows, columns) {
  return createRow({
    postfix: '__main',
    childClass: 'column',
    childValues: range(columns).map(getLitterByNumber),
  }) +
    range(rows).map(
        (row) => createRow({
          infoValue: row + 1,
          childClass: 'ceil',
          childValues: range(columns).map((item) => ''),
        })
    ).join('');
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
      $.create('div', {class: childClass + '__info'})
          .setHtml(infoValue)
  );
  $el.append(
      $.create('div', {class: childClass + 's'})
          .setHtml(
              childValues.map((child)=>
                $.create('div', {
                  class: childClass,
                  contenteditable: childClass === 'ceil',
                })
                    .setHtml(child).html
              ).join('')
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
