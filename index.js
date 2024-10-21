const express = require("express");
const app = express();
const _PORT = 3001;
const db = require("./models/db");
const packagesRoutes = require("./routes/packagesRoutes");
const subscriptionsRoutes = require("./routes/subscriptionsRoutes");
const cors = require("cors");

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api", packagesRoutes);
app.use("/api", subscriptionsRoutes);

app.listen(_PORT, () => {
  console.log("listening on port...");
});
