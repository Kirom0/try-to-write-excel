import {Component} from '@core/Component';
import {$} from '@core/dom';
import {formatDate} from '@/components/dashboard/dashboard.functions';
import {getTemplate} from '@/components/dashboard/dashboard.template';

export class DashboardComponent extends Component {
  constructor($root, options) {
    super($root, {
      name: 'Dashboard',
      ...options,
    });

    this.tables = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.includes('excel:')) {
        continue;
      }
      this.tables.push(key);
    }
  }

  init() {
    this.initListeners();
    this.htmlInitial();
  }

  htmlInitial() {
    const $template = getTemplate();
    const tables = [];
    if (!this.tables.length) {
      tables.push(
          $.create('p').setHtml('Вы пока не создали ни одной таблицы.')
      );
    } else {
      tables.push(
          $.create('div', {class: 'header'}).setHtml(`
          <span>Название</span>
          <span>Дата создания</span>
        `)
      );
      const $table = $.create('div', {class: 'table'});
      tables.push($table);
      this.tables.forEach((key) => {
        const excel = JSON.parse(localStorage.getItem(key));
        const id = key.slice(key.indexOf(':') + 1);
        $table.append($.create('a', {class: 'row', href: `#excel/${id}`}).setHtml(`
            <spam>${excel.header}</spam>
            <spam>${formatDate(+excel.created)}</spam>
        `));
      });
    }
    // eslint-disable-next-line camelcase
    const $db__table__view = $template.querySelector('.db__table__view');
    tables.forEach(($elem) => {
      $db__table__view.append($elem);
    });
    this.$root.append($template);
  }
}
