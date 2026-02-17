const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/complaintController");

router.post("/lodge", auth, controller.lodgeComplaint);
router.get("/", auth, controller.getAllComplaints);
router.get("/user/:userId", auth, controller.getUserComplaints);
router.patch("/:id/status", auth, controller.updateComplaintStatus);

module.exports = router;
