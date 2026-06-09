// export const addPageObject = (pageObject) => ({
//     type: 'ADD_PAGE_OBJECT',
//     payload: pageObject
// });

import { getData } from "../../../backend/api";

export const addPageObject = (page, index, filter = {}, limit = 10, referenceId, preData, fillType) => {
  return async (dispatch) => {
    if (fillType === "API") {
      dispatch({
        type: "ADD_PAGE_OBJECT_LOADING",
        payload: true,
        key: page + "-" + referenceId,
      });
      await getData({ ...filter, skip: index, limit: limit }, page)
        .then((response) => {
          dispatch({
            type: "ADD_PAGE_OBJECT_LOADING",
            payload: false,
            key: page + "-" + referenceId,
          });
          if (response.status === 200) {
            dispatch({
              type: "ADD_PAGE_OBJECT",
              payload: response.data?.response ? response.data : { count: 1, filterCount: 1, message: "Error on Data", response: [], success: true, totalCount: 0 },
              key: page + "-" + referenceId,
            });
          } else {
            dispatch({
              type: "ADD_PAGE_OBJECT",
              payload: { count: 1, filterCount: 1, message: "Error on Data", response: [], success: true, totalCount: 0 },
              key: page + "-" + referenceId,
            });
          }
        })
        .catch((error) => {
          dispatch({
            type: "ADD_PAGE_OBJECT_LOADING",
            payload: false,
            key: page + "-" + referenceId,
          });
        });
    } else {
      dispatch({
        type: "ADD_PAGE_OBJECT",
        payload: { count: preData?.length, filterCount: preData?.length, response: preData, success: true, totalCount: preData?.length },
        key: page + "-" + referenceId,
      });
    }
  };
};
