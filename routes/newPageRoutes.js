const express = require("express");
const router = express.Router();
const newPageController = require("../controllers/newPageController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/newPage/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", newPageController.getNewPageData);
router.post(
  `/welcome-section/create`,
  upload.single("image"),
  newPageController.addWelcomeSectionImage
);
router.delete(
  `/welcome-section/delete/:id`,
  newPageController.deleteWelcomeSectionImage
);

module.exports = router;
