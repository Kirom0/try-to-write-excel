import {$} from '@core/dom';

export function getTemplate() {
  /*
  return createRow({
    postfix: '__main',
    childClass: 'column',
    childValues: ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C', 'A'],
  }) + createRow({
    infoValue: '1',
    childClass: 'ceil',
    childValues: ['A1', 'B1', 'C1', 'A1', 'B1', 'C1', 'A1', 'B1', 'C1', 'A1'],
  }) + createRow({
    infoValue: '2',
    childClass: 'ceil',
    // eslint-disable-next-line max-len
    childValues: ['A2', 'B2', 'C2', 'A1', 'B1', 'C1', 'A1', 'B1', 'C1', 'A1'],
  });*/

  return `
    <div class="row__main">
      <div class="column__info"></div>
      <div class="columns">
        <div class="column">A</div>
        <div class="column">B</div>
        <div class="column">C</div>
        <div class="column">A</div>
        <div class="column">B</div>
        <div class="column">C</div>
        <div class="column">A</div>
        <div class="column">B</div>
        <div class="column">C</div>
        <div class="column">A</div>
        <div class="column">B</div>
        <div class="column">C</div>
        
      </div>
    </div>
    <div class="row">
      <div class="ceil__info">1</div>
      <div class="ceil selected" contenteditable>A1</div>
      <div class="ceil" contenteditable>B1</div>
      <div class="ceil" contenteditable>C1</div>
      <div class="ceil selected" contenteditable>A1</div>
      <div class="ceil" contenteditable>B1</div>
      <div class="ceil" contenteditable>C1</div>
      <div class="ceil selected" contenteditable>A1</div>
      <div class="ceil" contenteditable>B1</div>
      <div class="ceil" contenteditable>C1</div>
      <div class="ceil selected" contenteditable>A1</div>
      <div class="ceil" contenteditable>B1</div>
      <div class="ceil" contenteditable>C1</div>
    </div>
    <div class="row">
      <div class="ceil__info">2</div>
      <div class="ceil" contenteditable>A2</div>
      <div class="ceil" contenteditable>B2</div>
      <div class="ceil selected" contenteditable>C2</div>
      <div class="ceil" contenteditable>A2</div>
      <div class="ceil" contenteditable>B2</div>
      <div class="ceil selected" contenteditable>C2</div>
      <div class="ceil" contenteditable>A2</div>
      <div class="ceil" contenteditable>B2</div>
      <div class="ceil selected" contenteditable>C2</div>
      <div class="ceil" contenteditable>A2</div>
      <div class="ceil" contenteditable>B2</div>
      <div class="ceil selected" contenteditable>C2</div>
    </div>
    `;
}

// eslint-disable-next-line no-unused-vars
function createRow(options) {
  const {
    infoValue = '',
    postfix = '',
    childClass = '',
    childValues = [],
  } = options;

  const $el = $.create('div', 'row' + postfix);
  $el.append(
      $.create('div', childClass + '__info')
          .setHtml(infoValue)
  );
  childValues.forEach((child)=>{
    $el.append(
        $.create('div', childClass)
            .setHtml(child)
    );
  });
  return $el.html;
}
