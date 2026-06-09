const router = require("express").Router();
// controllers
const { addHallTicket, select, updateHallTicket, deleteHallTicket, getHallTicket, downloadHallTicket } = require("../controllers/hallTicket");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").post(addHallTicket).get(reqFilter, getHallTicket).put(updateHallTicket).delete(deleteHallTicket);

router.route("/select").get(reqFilter, select);

router.get("/get-hall-ticket", getHallTicket);
router.post("/download", downloadHallTicket);

module.exports = router;
