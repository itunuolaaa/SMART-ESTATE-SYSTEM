const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/visitorController");

router.post("/generate", auth, controller.generateQRCode);
router.post("/validate", auth, controller.validateQRCode);
router.get("/history/:residentId", auth, controller.getVisitorHistory);

module.exports = router;
