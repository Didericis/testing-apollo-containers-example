import { createStore, combineReducers, applyMiddleware } from 'redux';

import tasksReducer from 'dux/tasks';

const initialState = window.__PRELOADED_STATE__ || {};
delete window.__PRELOADED_STATE__;

export const reducer = combineReducers({
  tasks: tasksReducer,
});

export const store = (initial = {}) => {
  return createStore(
    reducer, 
    { ...initialState, ...initial },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
};
