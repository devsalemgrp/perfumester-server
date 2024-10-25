const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const _PORT = 3001;
const db = require("./models/db");
const packagesRoutes = require("./routes/packagesRoutes");
const subscriptionsRoutes = require("./routes/subscriptionsRoutes");
const productsRoutes = require("./routes/productsRoutes");
const homePageRoutes = require("./routes/homePageRoutes");
const mensPageRoutes = require("./routes/menPageRoutes");
const womensPageRoutes = require("./routes/womenPageRoutes");
const newPageRoutes = require("./routes/newPageRoutes");
const cors = require("cors");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line for form-data

app.use("/uploads", express.static("uploads"));

app.use("/api/packages", packagesRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/products", productsRoutes(upload));
app.use("/api/home", homePageRoutes);
app.use("/api/men", mensPageRoutes);
app.use("/api/women", womensPageRoutes);
app.use("/api/new", newPageRoutes);

app.listen(_PORT, () => {
  console.log("listening on port...");
});
