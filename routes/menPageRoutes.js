const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const menPageController = require("../controllers/menPageController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/menPage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", menPageController.getMensPageData);
router.post(
  "/home-section/create",
  upload.single("image"),
  menPageController.addHomeImage
);

router.delete("/home-section/delete/:id", menPageController.deleteHomeImage);

router.post(
  "/recommended-section/create",
  upload.single("image"),
  menPageController.addRecommendedImage
);
router.delete(
  "/recommended-section/delete/:id",
  menPageController.deleteRecommendedImage
);
router.patch(
  "/recommended-section/update/:id",
  upload.single("image"),
  menPageController.updateRecommendedImage
);

router.post(
  "/special-perfumes-section/create",
  upload.single("image"),
  menPageController.addSpecialPerfumeImage
);
router.delete(
  "/special-perfumes-section/delete/:id",
  menPageController.deleteSpecialPerfumeImage
);
router.patch(
  "/special-perfumes-section/update/:id",
  upload.single("image"),
  menPageController.updateSpecialPerfumeImage
);

router.post(
  "/special-backgrounds-section/create",
  upload.single("image"),
  menPageController.addSpecialBackgroundImage
);

router.delete(
  "/special-backgrounds-section/delete/:id",
  menPageController.deleteSpecialBackgroundImage
);

module.exports = router;
