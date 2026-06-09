const router = require("express").Router();
// controllers
const {
  addMenuItem,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  select,
  getSubMenuItem,
  getMenuItemPermission,
  updateMenuItemPermission,
  updateSubMenuItem,
  getSubMenuItemPermission,
  updateSubMenuItemPermission,
  deleteMenuItemPermission,
  deleteSubMenuItemPermission,
  deleteSubMenuItem,
} = require("../controllers/menuItem");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(addMenuItem)
  .get(reqFilter, getMenuItem)
  .put(updateMenuItem)
  .delete(deleteMenuItem);

router.get("/select", reqFilter, select);

router.get("/menuitem-permission", reqFilter, getMenuItemPermission); // get menu item permission
router.put("/menuitem-permission", updateMenuItemPermission); // update menu item permission
router.post("/menuitem-permission", updateMenuItemPermission); // add menu item permission
router.delete("/menuitem-permission", deleteMenuItemPermission); // delete menu item permission

router.get("/submenu-item", reqFilter, getSubMenuItem);
router.put("/submenu-item", updateSubMenuItem);
router.post("/submenu-item", addMenuItem);
router.delete("/submenu-item", deleteSubMenuItem);

router.get("/submenuitem-permission", reqFilter, getSubMenuItemPermission); // get submenu item permission
router.put("/submenuitem-permission", updateSubMenuItemPermission); // update submenu item permission
router.post("/submenuitem-permission", updateSubMenuItemPermission); // add submenu item permission
router.delete("/submenuitem-permission", deleteSubMenuItemPermission); // delete submenu item permission

module.exports = router;
