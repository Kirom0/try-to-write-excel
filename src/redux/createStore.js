import {reduce} from '@/redux/reduce';
import {atype} from '@/redux/actions';

export function createStore(initialState) {
  let state = initialState || {};
  const typesListeners = {};
  const listenersTypes = new Map();
  return {
    dispatch(action) {
      state = reduce(state, action);
      (typesListeners[action.type] || []).forEach((listener) => listener(state));
      (typesListeners[atype.ALL] || []).forEach((listener) => listener(state));
    },
    subscribe(types = [atype.ALL], listener) {
      listenersTypes.set(listener, types);

      types.forEach(
          (type) =>
            addToTypesListeners(typesListeners, type, listener)
      );

      return {
        unsubscribe() {
          listenersTypes[listener].forEach(
              (type) =>
                removeFromTypesListeners(typesListeners, type, listener)
          );
          removeFromTypesListeners(typesListeners, atype.ALL, listener);
          listenersTypes.delete(listener);
        },
      };
    },
    get() {
      return {...state};
    },
  };
}

function addToTypesListeners(typesListeners, type, listener) {
  if (!(type in typesListeners)) {
    typesListeners[type] = new Set();
  }
  typesListeners[type].add(listener);
}

function removeFromTypesListeners(typesListeners, type, listener) {
  typesListeners[type].delete(listener);
  if (typesListeners[type].length === 0) {
    delete typesListeners[type];
  }
}
