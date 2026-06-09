const router = require("express").Router();
const { createCenterRegistration, getCenterRegistration, updateCenterRegistration, deleteCenterRegistration, select, downloadAffiliation, getCentersByArea, bulkReassignDistrict, syncDistrictFromArea } = require("../controllers/centerRegistration");

// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(createCenterRegistration).get(reqFilter, protect, getCenterRegistration).put(updateCenterRegistration).delete(deleteCenterRegistration);

router.get("/select", reqFilter, select);
router.get("/area", reqFilter, getCentersByArea);
router.get("/download-affiliation", reqFilter, downloadAffiliation);
router.patch("/bulk-district", protect, bulkReassignDistrict);
router.post("/sync-district-from-area", protect, syncDistrictFromArea);

module.exports = router;
