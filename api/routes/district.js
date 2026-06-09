const router = require("express").Router();
// controllers
const { addDistrict, select, updateDistrict, deleteDistrict, getDistrict } = require("../controllers/district");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(addDistrict).get(reqFilter, getDistrict).put(updateDistrict).delete(deleteDistrict);

router.route("/select").get(reqFilter, select);

module.exports = router;
