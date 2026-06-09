const router = require("express").Router();
//controllers
const { addMenuRole, getMenuRole, updateMenuRole, deleteMenuRole } = require("../controllers/menuRole");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(protect, addMenuRole).get(reqFilter, protect, getMenuRole).put(protect, updateMenuRole).delete(protect, deleteMenuRole);

module.exports = router;
