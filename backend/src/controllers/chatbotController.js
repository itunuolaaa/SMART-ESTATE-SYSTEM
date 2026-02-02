const axios = require("axios");

exports.queryBot = async (req, res) => {
  const response = await axios.post(
    "http://localhost:5005/webhooks/rest/webhook",
    { sender: "user", message: req.body.message }
  );

  res.json({ reply: response.data[0]?.text || "No response" });
};