export const CLEAR_PARENT_ID = 'myapp/tasks/CLEAR_PARENT_ID';
export const SET_PARENT_ID = 'myapp/tasks/SET_PARENT_ID';

export default (state = {}, action) => {
  switch (action.type) {
    case CLEAR_PARENT_ID:
      return { ...state, parentId: null };
    case SET_PARENT_ID:
      return { ...state, parentId: action.parentId }
    default:
      return state;
  }
}

export const clearParentId = () => ({
  type: CLEAR_PARENT_ID,
});

export const setParentId = (parentId) => ({
  type: SET_PARENT_ID,
  parentId,
});
