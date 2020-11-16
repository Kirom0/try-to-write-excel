import {$} from '@core/dom';
import {range} from '@core/utils';

export function getTemplate(rows, columns) {
  return createHeadline({
    postfix: '__main',
    childClass: 'column',
    childValues: range(columns).map(getLitterByNumber),
  }).html +
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
                  contenteditable: '' + (childClass === 'cell'),
                  'data-column-title': getLitterByNumber(index),
                  'data-row-title': infoValue,
                })
                    .setHtml(child).html
              ).join('')
          )
  );

  return $el.html;
}

export function getSmartTemplate(cells, rows, columns) {
  const $elems = [];
  $elems.push(createHeadline({
    postfix: '__main',
    childClass: 'column',
    childValues: range(columns).map(getLitterByNumber),
  }));
  range(rows).map((index) => {
    const $el = $.create('div', {class: 'row'});
    $el.append(
        $.create('div', {
          class: 'cell__info',
          'data-type': 'resizable',
          'data-row-title': index,
        }).setHtml(index +
          $.create('div', {
            class: 'row__resizer',
            'data-resizer': 'row',
          }).html
        )
    );

    const $cellsContainer = $.create('div', {class: 'cells'});
    for (let i = 0; i < columns; i++) {
      $cellsContainer.append(cells[index][i].elem);
    }

    $el.append($cellsContainer);
    return $el;
  }).forEach(($el) => $elems.push($el));

  $elems.push($.create('div', {
    class: 'rows__resizer',
    'data-resizer': 'rows',
  }));

  return $elems;
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

  return $el;
}

export function cellInitial(row, col) {
  return $.create('div', {
    class: 'cell',
    'data-column-title': getLitterByNumber(col),
    'data-row-title': '' + row,
    contenteditable: true,
  });
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

export function getNumberByLitter(litter) {
  const A = 'A'.charCodeAt(0);
  let res = 0;
  for (let i = 0; i < litter.length; i++) {
    res = res * 26 + litter.charCodeAt(i) - A;
  }
  return res;
}
