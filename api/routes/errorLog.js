const router = require("express").Router();
// controllers
const {
  addErrorLog,
  getErrorLog,
  updateErrorLog,
  deleteErrorLog,
  select,
} = require("../controllers/errorLog");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(protect, addErrorLog)
  .get(reqFilter, protect, getErrorLog)
  .put(protect, updateErrorLog)
  .delete(protect, deleteErrorLog);

router.get("/select", reqFilter, protect, select);

module.exports = router;
