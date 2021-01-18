import {atype} from '@/redux/actions';

export function reduce(state, action) {
  const newState = {...state};

  const createCell = function(id) {
    if (!newState.cells[id]) {
      newState.cells[id] = {value: '', decoration: {}};
    }
  };

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
      createCell(action.data.key);
      newState.cells[action.data.key].value = action.data.value;
      return newState;
    case atype.TOOLBAR_STATE_CHANGED:
      createCell(action.data.cellId);
      newState.cells[action.data.cellId].decoration = action.data.state;
      return newState;
    default: return newState;
  }
}
