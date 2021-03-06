import {$} from '@core/dom';
import {ActiveRoute} from '@core/routes/ActiveRoute';

export class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('selector is required');
    }
    this.$placeholder = $(selector);
    this.routes = routes;

    this.changeHashHandler = this.changeHashHandler.bind(this);
  }

  init() {
    console.log('Router init');
    window.addEventListener('hashchange', this.changeHashHandler);
    this.currentPage = {destroy: ()=>{}};
    this.changeHashHandler();
  }

  changePage(Page, param) {
    this.currentPage.destroy();
    const page = new Page(param);

    this.$placeholder.setHtml('');
    this.$placeholder.append(page.getRoot());
    page.init();
  }

  changeHashHandler() {
    const params = ActiveRoute.param;
    const firstParam = params[0];
    if (Object.hasOwnProperty.call(this.routes.routes, firstParam)) {
      this.changePage(this.routes.routes[firstParam], params.slice(1));
    } else {
      this.changePage(this.routes.routes[this.routes.default], []);
    }
  }

  destroy() {
    window.removeEventListener('hashchange', this.changeHashHandler);
  }
}
