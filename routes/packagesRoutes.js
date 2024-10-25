const express = require("express");
const router = express.Router();
const packagesController = require("../controllers/packagesController");

router.get("/packages", packagesController.getAllPackages);
router.post("/packages/update", packagesController.editPackage);
router.patch("/packages/update-status", packagesController.editPackageActivity);

module.exports = router;
