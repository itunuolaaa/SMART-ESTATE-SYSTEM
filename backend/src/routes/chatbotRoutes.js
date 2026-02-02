const router = require("express").Router();
const { queryBot } = require("../controllers/chatbotController");

router.post("/query", queryBot);

module.exports = router;