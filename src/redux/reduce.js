import {atype} from '@/redux/actions';

export function reduce(state, action) {
  const newState = {...state};
  switch (action.type) {
    case atype.TABLE_RESIZE:
      if (action.orientation === 'column') {
        newState.columnSizes = {
          ...state.columnSizes,
          ...action.data,
        };
      } else
      if (action.orientation === 'row') {
        newState.rowSizes = {
          ...state.rowSizes,
          ...action.data,
        };
      }
      return newState;
    case atype.CELL_CHANGED:
      if (!newState.cells[action.data.key]) {
        newState.cells[action.data.key] = {value: '', decoration: {}};
      }
      newState.cells[action.data.key].value = action.data.value;
      return newState;
    case atype.TOOLBAR_STATE_CHANGED:
      newState.toolbar = {
        ...action.data,
      };
      return newState;
    default: return newState;
  }
}
