const router = require("express").Router();
const { getStats, runReset } = require("../controllers/dataReset");
const { protect } = require("../middleware/auth");

router.get("/stats", protect, getStats);
router.post("/", protect, runReset);

module.exports = router;
