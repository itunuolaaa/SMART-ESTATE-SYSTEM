const app = require("./src/app");

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
  app.get("/test", (req, res) => {
  res.json({ message: "Backend is running and connected!" });
});

});