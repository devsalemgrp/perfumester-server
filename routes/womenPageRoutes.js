const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const womenPageController = require("../controllers/womenPageController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/womenPage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", womenPageController.getWomensPageData);
router.post(
  "/home-section/create",
  upload.single("image"),
  womenPageController.addHomeImage
);

router.delete("/home-section/delete/:id", womenPageController.deleteHomeImage);

router.post(
  "/recommended-section/create",
  upload.single("image"),
  womenPageController.addRecommendedImage
);
router.delete(
  "/recommended-section/delete/:id",
  womenPageController.deleteRecommendedImage
);
router.patch(
  "/recommended-section/update/:id",
  upload.single("image"),
  womenPageController.updateRecommendedImage
);

router.post(
  "/special-perfumes-section/create",
  upload.single("image"),
  womenPageController.addSpecialPerfumeImage
);
router.delete(
  "/special-perfumes-section/delete/:id",
  womenPageController.deleteSpecialPerfumeImage
);
router.patch(
  "/special-perfumes-section/update/:id",
  upload.single("image"),
  womenPageController.updateSpecialPerfumeImage
);

router.post(
  "/special-backgrounds-section/create",
  upload.single("image"),
  womenPageController.addSpecialBackgroundImage
);

router.delete(
  "/special-backgrounds-section/delete/:id",
  womenPageController.deleteSpecialBackgroundImage
);

module.exports = router;
