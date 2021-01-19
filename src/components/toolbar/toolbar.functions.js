import {stateToCss} from '@/components/toolbar/toolbar.controller.config';
import {eo} from '@core/ExtendedObj';

export function initCellDecoration(cell, decoration) {
  cell.setInitDecoration(
      eo(decoration).map((k, v) => {
        return stateToCss[k](v);
      })
  );
}
