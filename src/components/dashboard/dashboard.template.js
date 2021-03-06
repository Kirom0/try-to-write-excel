import {$} from '@core/dom';

export function getTemplate() {
  return $.create('div', {class: 'db'}).setHtml(`
      <div class="db__header">
        <span>Excel dashboard</span>
      </div>
      <div class="db__toolbar">
        <div class="db__toolbar__view">
          <div class="item">
            <a href="#excel/${Date.now().toString()}" class="new-table" id="new-table"></a>
            <span>Новая таблица</span>
          </div>
          <div class="item">
            <a href="#"></a>
            <span>Новая таблица 1</span>
          </div>
          <div class="item">
            <a href="#"></a>
            <span>Новая таблица 2</span>
          </div>
          <div class="item">
            <a href="#"></a>
            <span>Новая таблица 3</span>
          </div>
        </div>
      </div>
      <div class="db__table">
        <div class="db__table__view">
        </div>
      </div>
    `);
}
