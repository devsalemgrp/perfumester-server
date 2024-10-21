const express = require("express");
const router = express.Router();
const subscriptionsController = require("../controllers/subscriptionsController");

router.get("/subscriptions", subscriptionsController.getAllSubscriptions);
router.post(
  "/subscriptions/create",
  subscriptionsController.createSubscription
);
router.patch(
  "/subscriptions/update-status",
  subscriptionsController.editSubscriptionActivity
);

module.exports = router;
