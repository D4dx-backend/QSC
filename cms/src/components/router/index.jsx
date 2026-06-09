import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "../../contexts/UserContext";

import Switch from "./switch";
import Page404 from "../project/pages/page404";
import { Container, MainContainer, SideBar } from "../core/layout/styels";
import { RowContainer } from "../styles/containers/styles";
import Header from "../core/layout/header";
import Footer from "../core/layout/footer";
import Menu from "../core/layout/menu";
import InternetStatusPopup from "../core/InternetStatusPopup";
import { GetIcon } from "../../icons";
import { currentMenu, menuStatus, selectedMenu } from "../../store/actions/common";
import { MobileSubMenu, SubMenuHead, SubMenuOpen } from "../core/layout/menu/styels";
import CustomPrivateRoute from "../project/router/private";
import CustomPublicRoute from "../project/router/public";
import Public404 from "../public/public404";
import Signup from "../public/signup";
import { getGroupedSubMenuSections } from "../../menuSections";

const PageRouter = () => {
  const userData = useUser();
  const menuStatus1 = useSelector((state) => state.menuStatus);
  const selectedMenuItem = useSelector((state) => state.selectedMenu);
  const selectedSubMenuItem = useSelector((state) => state.selectedSubMenu);
  const dispatch = useDispatch();
  const themeColors = useSelector((state) => state.themeColors);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 600px)").matches);
  const [pageLoaded, setPageLoaded] = useState(false);

  const updateIsMobile = useCallback(() => {
    setIsMobile(window.matchMedia("(max-width: 600px)").matches);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    mediaQuery.addEventListener("change", updateIsMobile);

    updateIsMobile();

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, [updateIsMobile]);

  useEffect(() => {
    if (!pageLoaded) {
      setPageLoaded(true);
    }
  }, [pageLoaded]);

  const createRouter = useCallback(
    (router, menu = true) => {
      const role = router.privilege ?? (menu ? router.menuRoles[0] : router.subMenuRoles[0]);
      if (router.itemOpenInSlug) {
        return (
          <React.Fragment key={router._id}>
            <Route key={router._id + "path"} path={router.path} element={<Switch setKey={router._id} user={userData} addPrivilege={role.add ?? false} delPrivilege={role.delete ?? false} updatePrivilege={role.update ?? false} exportPrivilege={role.export ?? false} clonePrivilege={role.clone ?? false} hideMenu={role.hideMenu ?? false} hideHeader={role.hideHeader ?? false} userType={role.userType} page={router.element} itemOpenInSlug={router.itemOpenInSlug} isSlug={false} />} />
            <Route key={router._id + "slug"} path={`${router.path}/:slug`} element={<Switch setKey={router._id + "slug"} user={userData} addPrivilege={role.add ?? false} delPrivilege={role.delete ?? false} updatePrivilege={role.update ?? false} exportPrivilege={role.export ?? false} clonePrivilege={role.clone ?? false} hideMenu={role.hideMenu ?? false} hideHeader={role.hideHeader ?? false} userType={role.userType} page={router.element} itemOpenInSlug={router.itemOpenInSlug} isSlug={true} />} />
          </React.Fragment>
        );
      } else {
        return <Route key={router._id + "path"} path={router.path} element={<Switch setKey={router._id} user={userData} addPrivilege={role.add ?? false} delPrivilege={role.delete ?? false} updatePrivilege={role.update ?? false} exportPrivilege={role.export ?? false} clonePrivilege={role.clone ?? false} hideMenu={role.hideMenu ?? false} hideHeader={role.hideHeader ?? false} userType={role.userType} page={router.element} itemOpenInSlug={router.itemOpenInSlug} isSlug={false} />} />;
      }
    },
    [userData]
  );

  const menuRoutes = useMemo(() => {
    if (!userData?.menu) return null;
    return userData.menu.map((menu) => {
      if (menu.submenus?.length > 0) {
        return (
          <React.Fragment key={menu._id}>
            {createRouter(menu)}
            {menu.submenus.map((submenu) => createRouter(submenu, false))}
          </React.Fragment>
        );
      }
      return createRouter(menu);
    });
  }, [userData.menu, createRouter]);

  const groupedSubMenuSections = useMemo(() => getGroupedSubMenuSections(selectedSubMenuItem?.submenus ?? []), [selectedSubMenuItem]);

  const renderGroupedSubMenus = () =>
    groupedSubMenuSections.map((section) => (
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
              className={submenu._id === selectedMenuItem._id ? "main active" : "main"}
              to={submenu.path}
            >
              <GetIcon icon={submenu.icon} /> <span>{submenu.label}</span>
            </Link>
          ) : null
        )}
      </div>
    ));

  return userData.token ? (
    userData.user.hasActiveSubscription === false ? (
      <BrowserRouter>
        <Signup></Signup>
      </BrowserRouter>
    ) : (
      <BrowserRouter>
        {!(selectedMenuItem.hideHeader ?? false) && <Header isMobile={isMobile} user={userData.user}></Header>}
        <MainContainer>
          {isMobile ? (
            <Menu isMobile={isMobile} user={userData} menu={userData.menu}></Menu>
          ) : (
            !(selectedMenuItem.hideMenu ?? false) && (
              <SideBar theme={themeColors} className={`${menuStatus1 && "active"} sticky`}>
                <div className="menus">
                  <Menu isMobile={isMobile} user={userData}></Menu>
                  <Footer></Footer>
                </div>
              </SideBar>
            )
          )}

          {selectedSubMenuItem?.submenus?.length > 0 && isMobile ? (
            <MobileSubMenu>
              <SubMenuOpen theme={themeColors}>{renderGroupedSubMenus()}</SubMenuOpen>
            </MobileSubMenu>
          ) : null}
          <RowContainer className={`content ${selectedMenuItem.hideMenu && "hidemenu"}`}>
            <Container className="nopadding" theme={themeColors}>
              <Routes>
                <Route key="login" path="/" element={<Switch page="login" />} />
                {menuRoutes}
                <React.Fragment key="private-routes">{CustomPrivateRoute()}</React.Fragment>
                <Route key="404" path="*" element={<Page404 />} />
              </Routes>
            </Container>
          </RowContainer>
          <InternetStatusPopup />
        </MainContainer>
      </BrowserRouter>
    )
  ) : (
    <BrowserRouter>
      <Routes>
        <Route key="public-login" path="/" element={<Switch page="login" />} />
        <React.Fragment key="public-routes">{CustomPublicRoute()}</React.Fragment>
        <Route key="public-404" path="*" element={<Public404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default React.memo(PageRouter);
