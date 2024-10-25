const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

module.exports = (upload) => {
  router.get("/", productsController.getAllProducts);
  router.get("/men", productsController.getMenProducts);
  router.get("/women", productsController.getWomenProducts);
  router.post(
    "/create",
    upload.single("image"),
    productsController.createProduct
  );
  router.delete("/delete/:id", productsController.deleteProduct);
  router.patch(
    "/update/:id",
    upload.single("image"),
    productsController.updateProduct
  );

  return router;
};
