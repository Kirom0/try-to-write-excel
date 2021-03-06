import {Page} from '@core/Page';
import {$} from '@core/dom';
import {DashboardComponent} from '@/components/dashboard/DashboardComponent';

export class DashboardPage extends Page {
  constructor(param) {
    super(param);
    this.$root = $.create('div');
    this.dashboard = new DashboardComponent(this.$root);
  }

  init() {
    this.dashboard.init();
  }

  getRoot() {
    return this.$root;
  }

  destroy() {
    this.dashboard.destroy();
  }
}
