import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectedMenu } from "../../../store/actions/common/index.js";
import RenderPage from "../../project/router/switch.jsx";

const Switch = ({ page, setKey, menu, ...privileges }) => {
  const location = useLocation();
  const selectedMenuItem = useSelector((state) => state.selectedMenu);
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedMenuItem.path !== location.pathname) {
      menu &&
        menu.forEach((element) => {
          const match = matchPath({ path: element.path }, location.pathname);
          if (match) {
            dispatch(selectedMenu(element));
          } else {
            element.submenus?.forEach((subelement) => {
              // console.log("path", subelement.path, location.pathname);
              if (subelement.path === location.pathname) {
                dispatch(selectedMenu(subelement));
                console.log("equal", subelement.label);
              }
            });
          }
        });
    }
  }, [location.pathname, selectedMenuItem, menu, dispatch]);
  return RenderPage(page, setKey, privileges);
};

export default Switch;
