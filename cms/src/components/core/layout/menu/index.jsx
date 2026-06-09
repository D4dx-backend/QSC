import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Nav, SubMenuHead } from "./styels";
import { useDispatch, useSelector } from "react-redux";
import { currentMenu, menuStatus, openedMenu, selectedMenu, selectedSubMenu } from "../../../../store/actions/common";
import { GetIcon } from "../../../../icons";
import { getGroupedMenuSections, getGroupedSubMenuSections } from "../../../../menuSections";

// import Search from "../../search";
const Menu = (props) => {
  const themeColors = useSelector((state) => state.themeColors);
  const selectedMenuItem = useSelector((state) => state.selectedMenu);
  const selectedSubMenuItem = useSelector((state) => state.selectedSubMenu);
  const groupedMenuSections = useMemo(() => getGroupedMenuSections(props.user?.menu ?? []), [props.user?.menu]);
  // const { hoverEnabled } = props;
  const dispatch = useDispatch();
  // const [searchValue, setSearchValue] = useState("");
  // const handleChange = (event) => {
  //   const search = event.target.value.toLowerCase(); // Convert to lower case for case-insensitive matching
  //   setSearchValue(search);
  //   let menu = JSON.parse(JSON.stringify(props.user.menu));
  //   const newMenu = menu.filter((menuItem) => {
  //     const labelMatches = menuItem.label.toLowerCase().includes(search);
  //     // Filter submenu labels
  //     const filteredSubmenu = menuItem.submenus.filter((submenuItem) => submenuItem.label.toLowerCase().includes(search));
  //     menuItem.submenus = labelMatches ? menuItem.submenus : filteredSubmenu;

  //     return labelMatches || filteredSubmenu.length > 0;
  //   });

  //   setCurrentMenus(newMenu);
  // };

  // console.log(selectedMenuItem)
  return (
    <>
      <Nav theme={themeColors}>
        {/* {!props.isMobile && <Search title={"Search"} className="menu active" theme={themeColors} placeholder="Search Menu" value={searchValue} onChange={handleChange}></Search>} */}
        {/* Link to the home page */}
        {groupedMenuSections.map((section) => (
          <div className="menu-section" key={section.key}>
            {section.title ? <SubMenuHead className="sidebar-section-title">{section.title}</SubMenuHead> : null}
            {section.items.map((menuItem) => {
              const firstSubMenu = menuItem?.submenus?.[0] ?? null;
              const hasSubMenus = Boolean(firstSubMenu);

              return menuItem.menuType !== "title" ? (
                <div className="menu-item" key={menuItem._id}>
                  {hasSubMenus ? (
                    <>
                      <Link
                        onClick={() => {
                          dispatch(selectedSubMenu(menuItem));
                          dispatch(openedMenu(menuItem._id));
                          dispatch(menuStatus(false));
                          dispatch(openedMenu(firstSubMenu._id));
                          dispatch(selectedMenu(firstSubMenu));
                          dispatch(currentMenu(firstSubMenu.label));
                        }}
                        className={`${menuItem._id === selectedMenuItem._id || selectedMenuItem.menu === menuItem._id ? "main active" : "main"}`}
                        to={firstSubMenu.path}
                      >
                        <GetIcon icon={menuItem.icon} />
                        {props.isMobile ? <span>{menuItem.label.substring(0, menuItem.label.indexOf(" ") !== -1 ? menuItem.label.indexOf(" ") : menuItem.label.length)}</span> : <span>{menuItem.label}</span>}
                      </Link>
                      {!props.isMobile && selectedSubMenuItem?._id === menuItem._id && (
                        <div className="inline-submenus">
                          {getGroupedSubMenuSections(menuItem.submenus).map((section) => (
                            <div className="submenu-section" key={section.key}>
                              {section.title ? <SubMenuHead className="submenu-section-title">{section.title}</SubMenuHead> : null}
                              {section.items.map((submenu) =>
                                submenu.menuType !== "title" ? (
                                  <Link
                                    key={submenu._id}
                                    onClick={() => {
                                      dispatch(menuStatus(false));
                                      dispatch(selectedMenu(submenu));
                                      dispatch(currentMenu(submenu.label));
                                    }}
                                    className={submenu._id === selectedMenuItem._id ? "sub active" : "sub"}
                                    to={submenu.path}
                                  >
                                    <GetIcon icon={submenu.icon} /> <span>{submenu.label}</span>
                                  </Link>
                                ) : null
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      onClick={() => {
                        dispatch(menuStatus(false));
                        dispatch(selectedSubMenu(null));
                        dispatch(selectedMenu(menuItem));
                        dispatch(currentMenu(menuItem.label));
                      }}
                      className={menuItem._id === selectedMenuItem._id ? "main active" : "main"}
                      to={menuItem.path}
                    >
                      <GetIcon icon={menuItem.icon} />
                      {props.isMobile ? <span>{menuItem.label.substring(0, menuItem.label.indexOf(" ") !== -1 ? menuItem.label.indexOf(" ") : menuItem.label.length)}</span> : <span>{menuItem.label}</span>}
                    </Link>
                  )}
                </div>
              ) : null;
            })}
          </div>
        ))}
      </Nav>
    </>
  );
};

export default Menu;
