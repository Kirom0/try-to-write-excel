export const atype = { // Action type
  ALL: 'ALL',
  TABLE_RESIZE: 'TABLE_RESIZE',
  CELL_CHANGED: 'CELL_CHANGED',
  TOOLBAR_STATE_CHANGED: 'TOOLBAR_STATE_CHANGED',
};

export function createAction(atype, data) {
  return {
    type: atype,
    data,
  };
}
