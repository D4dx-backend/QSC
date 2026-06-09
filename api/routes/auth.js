const router = require("express").Router();
//
const {
  login,
  getMe,
  register,
  updatePassword,
  studentLogin,
  getStudentHome,
  changePin,
  resetPin,
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", login);
router.post("/student-login", studentLogin);
router.post("/register", register);
router.post("/update-passoword", protect, updatePassword);
router.post("/change-pin", protect, changePin);
router.post("/reset-pin", protect, resetPin);

router.get("/get-me", protect, getMe);
router.get("/student-home", protect, getStudentHome);

module.exports = router;
