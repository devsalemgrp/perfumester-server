const express = require("express");
const router = express.Router();
const homePageController = require("../controllers/homePageController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/homePage/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }); // Create multer instance

router.get("/", homePageController.getHomePageData);
router.post(
  "/welcome-section/create",
  upload.single("image"),
  homePageController.addWelcomeSectionImage
);
router.delete(
  "/welcome-section/delete/:id",
  homePageController.deleteWelcomeSectionImage
);

router.patch("/hero-section/update", homePageController.editHeroSectionData);

router.post(
  "/section2-section/create",
  upload.single("image"),
  homePageController.addSection2Image
);
router.patch(
  "/section2-section/update/:id",
  upload.single("image"),
  homePageController.editSection2Image
);
router.delete(
  "/section2-section/delete/:id",
  homePageController.deleteSection2Image
);
router.patch("/cta-section/update", homePageController.editCtaData);

module.exports = router;
