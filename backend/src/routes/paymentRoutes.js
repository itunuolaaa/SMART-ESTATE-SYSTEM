const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/paymentController");

router.post("/pay", auth, controller.makePayment);
router.get("/:userId", auth, controller.getPayments);

module.exports = router;