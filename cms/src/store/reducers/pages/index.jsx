const initialState = {};
const initialLoading = {};
function pages(state = initialState, action) {
  switch (action.type) {
    case "ADD_PAGE_OBJECT":
      return {
        ...state,
        [action.key]: action.payload,
      };
    default:
      return state;
  }
}
function pagesLoading(state = initialLoading, action) {
  switch (action.type) {
    case "ADD_PAGE_OBJECT_LOADING":
      return {
        ...state,
        [action.key]: action.payload,
      };
    default:
      return state;
  }
}

export { pages, pagesLoading };
