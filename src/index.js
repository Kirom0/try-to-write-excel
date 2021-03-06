import './scss/index.scss';
import {Router} from '@core/routes/Router';
import {DashboardPage} from '@/pages/DashboardPage';
import {ExcelPage} from '@/pages/ExcelPage';

const router = new Router('#app', {
  default: 'dashboard',
  routes: {
    dashboard: DashboardPage,
    excel: ExcelPage,
  },
});
router.init();
