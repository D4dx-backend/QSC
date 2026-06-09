const router = require("express").Router();
//controllers
const { addSubMenuRole, getSubMenuRole, updateSubMenuRole, deleteSubMenuRole } = require("../controllers/subMenuRole");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(protect, addSubMenuRole).get(reqFilter, protect, getSubMenuRole).put(protect, updateSubMenuRole).delete(protect, deleteSubMenuRole);

module.exports = router;
