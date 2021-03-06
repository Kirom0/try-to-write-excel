import {Page} from '@core/Page';
import {createStore} from '@/redux/createStore';
import {clone, debounce, storage} from '@core/utils';
import {initialExcelState} from '@/redux/initialExcelState';
import {Excel} from '@core/Excel';
import {HeaderComponent} from '@/components/header/HeaderComponent';
import {ToolbarComponent} from '@/components/toolbar/ToolbarComponent';
import {FormulaComponent} from '@/components/formula/FormulaComponent';
import {TableComponent} from '@/components/table/TableComponent';
import {atype} from '@/redux/actions';

export class ExcelPage extends Page {
  constructor(params) {
    super(params);
    const id = params.length && params[0] ? params[0] : Date.now().toString();
    const storeKey = `excel:${id}`;
    const store = createStore(
        storage(storeKey) ||
      storage(storeKey, {
        ...clone(initialExcelState),
        created: Date.now().toString(),
      })
    );

    const changeStorage = debounce((state) => {
      console.log('App state: ', state);
      storage(storeKey, state);
    }, 1000);

    store.subscribe([atype.ALL], changeStorage);

    this.excel = new Excel({
      components: [
        HeaderComponent,
        ToolbarComponent,
        FormulaComponent,
        TableComponent,
      ],
      classes: 'excel',
      store,
    });
  }

  init() {
    this.excel.init();
  }

  getRoot() {
    return this.excel.getRoot();
  }

  destroy() {
    this.excel.destroy();
  }
}
