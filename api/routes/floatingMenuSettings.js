const router = require("express").Router();
// controllers
const { addFloatingSettings, select, updateFloatingSettings, deleteFloatingSettings, getFloatingSettings } = require("../controllers/floatingMenuSettings");
// middleware
const { protect } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(protect, addFloatingSettings).get(reqFilter, getFloatingSettings).put(protect, updateFloatingSettings).delete(protect, deleteFloatingSettings);

router.route("/select").get(reqFilter, protect, select);

module.exports = router;
