const router = require("express").Router();
const { getCurrent, update } = require("../controllers/examSettings");
const { protect } = require("../middleware/auth");

router.get("/", protect, getCurrent);
router.put("/", protect, update);

module.exports = router;
