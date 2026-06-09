const router = require("express").Router();
const { recompute, summary, override } = require("../controllers/examAllocation");
const { protect } = require("../middleware/auth");

router.post("/recompute", protect, recompute);
router.get("/summary", protect, summary);
router.patch("/override", protect, override);

module.exports = router;
