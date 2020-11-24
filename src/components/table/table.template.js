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
            <div class="row">1</div>
            <div class="row">2</div>
            <div class="row">3</div>
            <div class="row">4</div>
            <div class="row">5</div>
            <div class="row">6</div>
            <div class="row">7</div>
            <div class="row">8</div>
            <div class="row">9</div>
            <div class="filler" data-filler="vertical"></div>
          </div>    
        </div>
        <div class="SWPlug"></div>
      </div>
      <div class="middle">
        <div class="columnsHeadline" data-type="columnsHeadline">
          <div class="columns">
            <div class="column">A</div>
            <div class="column">B</div>
            <div class="column">C</div>
            <div class="column">D</div>
            <div class="column">E</div>
            <div class="column">F</div>
            <div class="column">G</div>
            <div class="column">H</div>
            <div class="column">I</div>
            <div class="column">J</div>
            <div class="column">K</div>
            <div class="column">L</div>
            <div class="column">M</div>
            <div class="column">N</div>
            <div class="column">O</div>
            <div class="filler" data-filler="horizontal"></div>
          </div>
        </div>
        <div class="table">
          <div class="rows">
            <div class="cells">
              <div class="cell selected" contenteditable>A1</div>
              <div class="cell" contenteditable>B1</div>
              <div class="cell" contenteditable>C1</div>
              <div class="cell" contenteditable>D1</div>
              <div class="cell" contenteditable>E1</div>
              <div class="cell" contenteditable>F1</div>
              <div class="cell" contenteditable>G1</div>
              <div class="cell" contenteditable>H1</div>
              <div class="cell" contenteditable>I1</div>
              <div class="cell" contenteditable>J1</div>
              <div class="cell" contenteditable>K1</div>
              <div class="cell" contenteditable>L1</div>
              <div class="cell" contenteditable>M1</div>
              <div class="cell" contenteditable>N1</div>
              <div class="cell" contenteditable>O1</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A2</div>
              <div class="cell selected" contenteditable>B2</div>
              <div class="cell" contenteditable>C2</div>
              <div class="cell" contenteditable>D2</div>
              <div class="cell" contenteditable>E2</div>
              <div class="cell" contenteditable>F2</div>
              <div class="cell" contenteditable>G2</div>
              <div class="cell" contenteditable>H2</div>
              <div class="cell" contenteditable>I2</div>
              <div class="cell" contenteditable>J2</div>
              <div class="cell" contenteditable>K2</div>
              <div class="cell" contenteditable>L2</div>
              <div class="cell" contenteditable>M2</div>
              <div class="cell" contenteditable>N2</div>
              <div class="cell" contenteditable>O2</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A3</div>
              <div class="cell" contenteditable>B3</div>
              <div class="cell selected" contenteditable>C3</div>
              <div class="cell" contenteditable>D3</div>
              <div class="cell" contenteditable>E3</div>
              <div class="cell" contenteditable>F3</div>
              <div class="cell" contenteditable>G3</div>
              <div class="cell" contenteditable>H3</div>
              <div class="cell" contenteditable>I3</div>
              <div class="cell" contenteditable>J3</div>
              <div class="cell" contenteditable>K3</div>
              <div class="cell" contenteditable>L3</div>
              <div class="cell" contenteditable>M3</div>
              <div class="cell" contenteditable>N3</div>
              <div class="cell" contenteditable>O3</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A4</div>
              <div class="cell" contenteditable>B4</div>
              <div class="cell" contenteditable>C4</div>
              <div class="cell selected" contenteditable>D4</div>
              <div class="cell" contenteditable>E4</div>
              <div class="cell" contenteditable>F4</div>
              <div class="cell" contenteditable>G4</div>
              <div class="cell" contenteditable>H4</div>
              <div class="cell" contenteditable>I4</div>
              <div class="cell" contenteditable>J4</div>
              <div class="cell" contenteditable>K4</div>
              <div class="cell" contenteditable>L4</div>
              <div class="cell" contenteditable>M4</div>
              <div class="cell" contenteditable>N4</div>
              <div class="cell" contenteditable>O4</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A5</div>
              <div class="cell" contenteditable>B5</div>
              <div class="cell" contenteditable>C5</div>
              <div class="cell" contenteditable>D5</div>
              <div class="cell selected" contenteditable>E5</div>
              <div class="cell" contenteditable>F5</div>
              <div class="cell" contenteditable>G5</div>
              <div class="cell" contenteditable>H5</div>
              <div class="cell" contenteditable>I5</div>
              <div class="cell" contenteditable>J5</div>
              <div class="cell" contenteditable>K5</div>
              <div class="cell" contenteditable>L5</div>
              <div class="cell" contenteditable>M5</div>
              <div class="cell" contenteditable>N5</div>
              <div class="cell" contenteditable>O5</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A6</div>
              <div class="cell" contenteditable>B6</div>
              <div class="cell" contenteditable>C6</div>
              <div class="cell" contenteditable>D6</div>
              <div class="cell" contenteditable>E6</div>
              <div class="cell selected" contenteditable>F6</div>
              <div class="cell" contenteditable>G6</div>
              <div class="cell" contenteditable>H6</div>
              <div class="cell" contenteditable>I6</div>
              <div class="cell" contenteditable>J6</div>
              <div class="cell" contenteditable>K6</div>
              <div class="cell" contenteditable>L6</div>
              <div class="cell" contenteditable>M6</div>
              <div class="cell" contenteditable>N6</div>
              <div class="cell" contenteditable>O6</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A7</div>
              <div class="cell" contenteditable>B7</div>
              <div class="cell" contenteditable>C7</div>
              <div class="cell" contenteditable>D7</div>
              <div class="cell" contenteditable>E7</div>
              <div class="cell" contenteditable>F7</div>
              <div class="cell selected" contenteditable>G7</div>
              <div class="cell" contenteditable>H7</div>
              <div class="cell" contenteditable>I7</div>
              <div class="cell" contenteditable>J7</div>
              <div class="cell" contenteditable>K7</div>
              <div class="cell" contenteditable>L7</div>
              <div class="cell" contenteditable>M7</div>
              <div class="cell" contenteditable>N7</div>
              <div class="cell" contenteditable>O7</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A8</div>
              <div class="cell" contenteditable>B8</div>
              <div class="cell" contenteditable>C8</div>
              <div class="cell" contenteditable>D8</div>
              <div class="cell" contenteditable>E8</div>
              <div class="cell" contenteditable>F8</div>
              <div class="cell" contenteditable>G8</div>
              <div class="cell selected" contenteditable>H8</div>
              <div class="cell" contenteditable>I8</div>
              <div class="cell" contenteditable>J8</div>
              <div class="cell" contenteditable>K8</div>
              <div class="cell" contenteditable>L8</div>
              <div class="cell" contenteditable>M8</div>
              <div class="cell" contenteditable>N8</div>
              <div class="cell" contenteditable>O8</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="cells">
              <div class="cell" contenteditable>A9</div>
              <div class="cell" contenteditable>B9</div>
              <div class="cell" contenteditable>C9</div>
              <div class="cell" contenteditable>D9</div>
              <div class="cell" contenteditable>E9</div>
              <div class="cell" contenteditable>F9</div>
              <div class="cell" contenteditable>G9</div>
              <div class="cell" contenteditable>H9</div>
              <div class="cell selected" contenteditable>I9</div>
              <div class="cell" contenteditable>J9</div>
              <div class="cell" contenteditable>K9</div>
              <div class="cell" contenteditable>L9</div>
              <div class="cell" contenteditable>M9</div>
              <div class="cell" contenteditable>N9</div>
              <div class="cell" contenteditable>O9</div>
              <div class="filler" data-filler="horizontal"></div>
            </div>
            <div class="filler" data-filler="vertical"></div>
          </div>
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
