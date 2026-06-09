const router = require("express").Router();
// controllers
const { addMenu, getMenu, updateMenu, deleteMenu, getHierarchicalMenu, select } = require("../controllers/menu");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(addMenu).get(reqFilter, getMenu).put(updateMenu).delete(deleteMenu);
router.route("/hierarchical").get(getHierarchicalMenu);
router.route("/select").get(select);
module.exports = router;
