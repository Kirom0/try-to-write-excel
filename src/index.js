import './scss/index.scss';
import {Excel} from '@core/Excel';
import {HeaderComponent} from '@/components/header/HeaderComponent';
import {ToolbarComponent} from '@/components/toolbar/ToolbarComponent';
import {FormulaComponent} from '@/components/formula/FormulaComponent';
import {TableComponent} from '@/components/table/TableComponent';
import {createStore} from '@/redux/createStore';
import {storage} from '@core/utils';
import {initialState} from '@/redux/initialState';

const store = createStore(
    storage('excel_state') ||
  storage('excel_state', initialState['excel_state'])
);

store.subscribe(['ALL'], (state) => {
  console.log('App state: ', state);
  storage('excel_state', state);
});

const excel = new Excel('#app', {
  components: [
    HeaderComponent,
    ToolbarComponent,
    FormulaComponent,
    TableComponent,
  ],
  classes: 'excel',
  store,
});

excel.render();
