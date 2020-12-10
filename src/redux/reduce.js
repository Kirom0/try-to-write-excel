import {atype} from '@/redux/actions';

export function reduce(state, action) {
  switch (action.type) {
    case atype.TABLE_RESIZE:
      if (action.orientation === 'column') {
        return {...state, columnSizes: {...state.columnSizes, ...action.data}};
      } else
      if (action.orientation === 'row') {
        return {...state, rowSizes: {...state.rowSizes, ...action.data}};
      }
      return state;
    case atype.CELL_CHANGED:
      return {...state, cells: {...state.cells, ...action.data}};
    default: return state;
  }
}
