const router = require("express").Router();
// controllers
const { addArea, select, updateArea, deleteArea, getArea, getAreaByDistrict } = require("../controllers/area");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(addArea).get(reqFilter, protect, getArea).put(updateArea).delete(deleteArea);

router.get("/select", reqFilter, select);
router.get("/get-area-by-district", reqFilter, getAreaByDistrict);

module.exports = router;
