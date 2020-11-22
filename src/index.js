import './scss/index.scss';
import {Excel} from '@core/Excel';
import {HeaderComponent} from '@/components/header/HeaderComponent';
import {ToolbarComponent} from '@/components/toolbar/ToolbarComponent';
import {FormulaComponent} from '@/components/formula/FormulaComponent';
import {TableComponent} from '@/components/table/TableComponent';


const excel = new Excel('#app', {
  components: [
    HeaderComponent,
    ToolbarComponent,
    FormulaComponent,
    TableComponent,
  ],
  classes: 'excel',
});

excel.render();
