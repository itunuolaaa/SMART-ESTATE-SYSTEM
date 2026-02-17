const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/paymentController");

router.post("/pay", auth, controller.createPayment);
router.get("/dues/:userId", auth, controller.getDues);
router.get("/history/:userId", auth, controller.getUserPayments);
router.get("/", auth, controller.getAllPayments);

module.exports = router;