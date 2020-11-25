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
    childValues: range(columns),
  }));
  range(rows).map((index) => {
    const $el = $.create('div', {class: 'row'});
    $el.append(
        $.create('div', {
          class: 'cell__info',
          'data-type': 'resizable',
          'data-row': index,
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
                  'data-column': '' + child,
                })
                    .setHtml(getLitterByNumber(child) + resizer).html
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
    'data-column': '' + col,
    'data-row': '' + row,
    'data-type': 'cell',
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

export function getPureHtml() {
  /* return `
      <div class="row__main">
        <div class="column__info"></div>
        <div class="columns">
          <div class="column">A</div>
          <div class="column">B</div>
          <div class="column">C</div>
          <div class="column">D</div>
          <div class="column">E</div>
          <div class="column">F</div>
          <div class="column">G</div>
          <div class="column">H</div>
          <div class="column">E</div>
          <div class="column">F</div>
          <div class="column">K</div>
        </div>
      </div>
      <div class="rows">
        <div class="row__info">1</div>
        <div class="row__info">2</div>
      </div>
      <div class="table">
        <div class="cells">
          <div class="cell selected" contenteditable>A1</div>
          <div class="cell" contenteditable>B1</div>
          <div class="cell" contenteditable>C1</div>
          <div class="cell" contenteditable>D1</div>
          <div class="cell" contenteditable>E1</div>
          <div class="cell" contenteditable>F1</div>
          <div class="cell" contenteditable>G1</div>
          <div class="cell" contenteditable>H1</div>
          <div class="cell" contenteditable>E1</div>
          <div class="cell" contenteditable>F1</div>
          <div class="cell" contenteditable>K1</div>
        </div>
        <div class="cells">
          <div class="cell" contenteditable>A2</div>
          <div class="cell" contenteditable>B2</div>
          <div class="cell" contenteditable>C2</div>
          <div class="cell selected" contenteditable>D2</div>
          <div class="cell" contenteditable>E2</div>
          <div class="cell" contenteditable>F2</div>
          <div class="cell" contenteditable>G2</div>
          <div class="cell" contenteditable>H2</div>
          <div class="cell" contenteditable>E2</div>
          <div class="cell" contenteditable>F2</div>
          <div class="cell" contenteditable>K2</div>
        </div>
      </div>

    `;*/
  return `
    <div class="container">
      <div class="left">
        <div class="NWPlug"></div>
        <div class="rowsHeadline" data-type="rowsHeadline">
          <div class="rows">
            <div class="row" data-type="resizable" data-row-title="0">1
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="1">2
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="2">3
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="3">4
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="4">5
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="5">6
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="6">7
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="7">8
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="row" data-type="resizable" data-row-title="8">9
                <div class="row__resizer" data-resizer="row"></div>
            </div>
            <div class="filler" data-filler="vertical"></div>
          </div>    
        </div>
        <div class="SWPlug"></div>
      </div>
      <div class="middle">
        <div class="columnsHeadline" data-type="columnsHeadline">
          <div class="columns">
            <div class="column" data-type="resizable" data-column-title="0">A
                <div class="column__resizer" data-resizer="column"></div>
            </div>
            <div class="column" data-type="resizable" data-column-title="1">B
                <div class="column__resizer" data-resizer="column"></div>
            </div>
            <div class="column" data-type="resizable" data-column-title="2">C
                <div class="column__resizer" data-resizer="column"></div>
            </div>
            <div class="column" data-type="resizable" data-column-title="3">D
                <div class="column__resizer" data-resizer="column"></div>
            </div>
            <div class="filler" data-filler="horizontal"></div>
          </div>
        </div>
        <div class="table">
          <div class="rows">
            <div class="cells" data-row-title="0">
              <div class="cell selected" contenteditable data-column-title="0" >A1</div>
              <div class="cell" contenteditable data-column-title="1">B1</div>
              <div class="cell" contenteditable data-column-title="2">C1</div>
              <div class="cell" contenteditable data-column-title="3">D1</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="1">
              <div class="cell" contenteditable data-column-title="0" >A2</div>
              <div class="cell selected" contenteditable data-column-title="1">B2</div>
              <div class="cell" contenteditable data-column-title="2">C2</div>
              <div class="cell" contenteditable data-column-title="3">D2</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="2">
              <div class="cell" contenteditable data-column-title="0">A3</div>
              <div class="cell" contenteditable data-column-title="1">B3</div>
              <div class="cell selected" contenteditable data-column-title="2">C3</div>
              <div class="cell" contenteditable data-column-title="3">D3</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="3">
              <div class="cell" contenteditable data-column-title="0">A4</div>
              <div class="cell" contenteditable data-column-title="1">B4</div>
              <div class="cell" contenteditable data-column-title="2">C4</div>
              <div class="cell selected" contenteditable data-column-title="3">D4</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="4">
              <div class="cell" contenteditable data-column-title="0">A5</div>
              <div class="cell" contenteditable data-column-title="1">B5</div>
              <div class="cell" contenteditable data-column-title="2">C5</div>
              <div class="cell" contenteditable data-column-title="3">D5</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="5">
              <div class="cell" contenteditable data-column-title="0">A6</div>
              <div class="cell" contenteditable data-column-title="1">B6</div>
              <div class="cell" contenteditable data-column-title="2">C6</div>
              <div class="cell" contenteditable data-column-title="3">D6</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="6">
              <div class="cell" contenteditable data-column-title="0">A7</div>
              <div class="cell" contenteditable data-column-title="1">B7</div>
              <div class="cell" contenteditable data-column-title="2">C7</div>
              <div class="cell" contenteditable data-column-title="3">D7</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="7">
              <div class="cell" contenteditable data-column-title="0">A8</div>
              <div class="cell" contenteditable data-column-title="1">B8</div>
              <div class="cell" contenteditable data-column-title="2">C8</div>
              <div class="cell" contenteditable data-column-title="3">D8</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells" data-row-title="8">
              <div class="cell" contenteditable data-column-title="0">A9</div>
              <div class="cell" contenteditable data-column-title="1">B9</div>
              <div class="cell" contenteditable data-column-title="2">C9</div>
              <div class="cell" contenteditable data-column-title="3">D9</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="filler" data-filler="vertical"></div>
          </div>
          <div class="columns__resizer" data-resizer="columns"></div>
          <div class="rows__resizer" data-resizer="rows"></div>
        </div>
        <div class="scrollBottom">
          <div class="scrollContainer" data-type="scroller-container">
            <span
              class="horizontalScroller"
              data-type="scroller"
              data-scroller="horizontal"
            ></span>
          </div>
          <span class="material-icons" id="scroll" data-scroll="left">keyboard_arrow_left</span>
          <span class="material-icons" id="scroll" data-scroll="right">keyboard_arrow_right</span>
         </div>  
      </div>
      <div class="right">
        <div class="NEPlug"></div>
        <div class="scrollRight">
            <div class="scrollContainer">
              <span
                class="verticalScroller"
                data-type="scroller"
                data-scroller="vertical"
              ></span>
            </div>
            <span class="material-icons" id="scroll" data-scroll="up">keyboard_arrow_up</span>
            <span class="material-icons" id="scroll" data-scroll="down">keyboard_arrow_down</span>
        </div>
        <div class="SEPlug"></div>
      </div>
    </div>
  `;
}
