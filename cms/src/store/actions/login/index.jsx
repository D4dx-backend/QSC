// its middlewear to handle reducer call to update a state

import { postData } from "../../../backend/api";
import CustomRoutes from "../../../components/project/router/custom";
import { getDefaultMenuSelection } from "../../../menuSections";

const buildStudentHomeRoute = (responseData) => ({
  _id: "student-home-route",
  label: "Home",
  sequence: 0,
  icon: "home",
  status: true,
  isLink: false,
  path: "/home",
  element: "student-home",
  itemOpenInSlug: false,
  hideMenu: false,
  hideHeader: false,
  showInMenu: true,
  menuGroup: "Home",
  privilege: {
    status: true,
    add: false,
    update: false,
    delete: false,
    export: false,
    clone: false,
    userType: responseData?.user?.userType?._id,
  },
  submenus: [],
});

const normalizeStudentMenu = (menu = []) =>
  menu.map((item) => ({
    ...item,
    menuGroup: "Home",
    submenus: Array.isArray(item?.submenus)
      ? item.submenus.map((submenu) => ({
          ...submenu,
          menuGroup: "Home",
        }))
      : [],
  }));

const fetchLogin = (data, predata = null) => {
  return async (dispatch) => {
    try {
      // Dispatch loading state
      dispatch({ type: "FETCH_USER_LOGIN_LOADING" });

      // Determine the response to use
      const response = predata ? predata : await postData(data, "auth/login");

      // Check if the response is successful
      if (response.status === 200) {
        if (response.data.success) {
          const baseMenu = [...(response.data.menu ?? []), ...CustomRoutes()];
          const isStudent = response.data?.user?.userType?.role === "Student";
          const mergedMenu = isStudent ? [buildStudentHomeRoute(response.data), ...normalizeStudentMenu(baseMenu)] : baseMenu;
          const defaultSelection = getDefaultMenuSelection(mergedMenu);

          // Prepare the data to dispatch
          const payloadData = {
            ...response.data,
            menu: mergedMenu,
          };

          // Dispatch actions to update the state
          dispatch({ type: "MENU_STATUS", payload: false });
          dispatch({ type: "SELECTED_SUBMENU", payload: defaultSelection.selectedSubMenu });
          dispatch({ type: "SELECTED_MENU", payload: defaultSelection.selectedMenu });
          dispatch({ type: "CURRENT_MENU", payload: defaultSelection.currentMenu });
          dispatch({ type: "FETCH_USER_LOGIN_SUCCESS", payload: payloadData });
        } else {
          // Dispatch error if login is unsuccessful
          dispatch({
            type: "FETCH_USER_LOGIN_ERROR",
            payload: response.data.message || "Something went wrong!",
          });
        }
      } else {
        // Handle unexpected response status
        dispatch({
          type: "FETCH_USER_LOGIN_ERROR",
          payload: "Unexpected response status: validationFailed",
        });
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      dispatch({
        type: "FETCH_USER_LOGIN_ERROR",
        payload: error.message || "An error occurred while logging in.",
      });
    }
  };
};
const clearLogin = () => {
  return (dispatch) => {
    dispatch({
      type: "CLEAR_USER_LOGIN",
    });
  };
};
const clearLoginSession = () => {
  return (dispatch) => {
    dispatch({
      type: "CLEAR_USER_LOGIN_SESSION",
    });
  };
};
const udpateLogin = (data) => {
  return (dispatch) => {
    dispatch({
      type: "FETCH_USER_LOGIN_SUCCESS",
      payload: data,
    });
  };
};
export { fetchLogin, clearLogin, clearLoginSession, udpateLogin };
