const database = require("../models/db");
const path = require("path");
const fs = require("fs");
const getAllProducts = (req, res) => {
  const products = database.db.query("SELECT * FROM products", (err, rows) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
    } else {
      res.status(200).json({ data: rows });
    }
  });
};

const getMenProducts = (req, res) => {
  const products = database.db.query(
    "SELECT * FROM products WHERE category = ? ",
    ["male"],
    (err, rows) => {
      if (err) {
        res
          .status(500)
          .json({ error: "Internal Server Error", message: err.message });
      } else {
        res.status(200).json({ data: rows });
      }
    }
  );
};
const getWomenProducts = (req, res) => {};
const createProduct = (req, res) => {
  const { name, price, description, status, subscriptionCategory, category } =
    req.body;
  if (
    !name ||
    !price ||
    !description ||
    !status ||
    !subscriptionCategory ||
    !category
  ) {
    if (!name) {
      return res.status(400).json({ error: "Name is Missing" });
    }
    if (!price) {
      return res.status(400).json({ error: "Price is Missing" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description is Missing" });
    }
    if (!status) {
      return res.status(400).json({ error: "Status is Missing" });
    }
    if (!subscriptionCategory) {
      return res
        .status(400)
        .json({ error: "Subscription Category is Missing" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is Missing" });
    }
    return res.status(400).json({ error: "Missing required fields" });
  }

  const imageFilePath = `/uploads/${req.file.filename}`;
  const newProduct = database.db.query(
    "INSERT INTO products (name,price,description,status,image,subscriptionCategory,category) VALUES (?,?,?,?,?,?,?)",
    [
      name,
      price,
      description,
      status,
      imageFilePath,
      subscriptionCategory,
      category,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({
          data: {
            id: result.insertId,
            name,
            price,
            description,
            status,
            imageFilePath,
            subscriptionCategory,
            category,
          },
        });
      }
    }
  );
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  database.db.query(
    `SELECT image FROM products WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database query error" });
      }
      if (rows.length == 0) {
        return res.status(404).json({ error: "PRODUCT NOT FOUND" });
      }

      const imagePath = rows[0].image;
      const fullImagePath = path.join(__dirname, "..", imagePath);

      if (fs.existsSync(fullImagePath)) {
        fs.unlink(fullImagePath, (unLinkErr) => {
          if (unLinkErr) {
            console.log("ERROR DELETING IMAGE __", unLinkErr);
          }
        });
      }

      database.db.query(
        `DELETE FROM products WHERE id = ?`,
        [id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          res.status(200).json({ data: result.affectedRows });
        }
      );
    }
  );
};

const updateProduct = (req, res) => {
  const { name, price, description, status, subscriptionCategory, category } =
    req.body;
  const { id } = req.params;

  if (!name || !price || !description || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newImage = req.file;

  database.db.query(
    "SELECT image FROM products WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database query error" });
      }

      if (results.length == 0) {
        return res.status(404).json({ error: "PRODUCT NOT FOUND" });
      }
      const imagePath = results[0].image;
      const fullPath = path.join(__dirname, "..", imagePath);

      if (newImage) {
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error("Error deleting previous image:", err);
            }
          });
        }

        const newImagePath = `/uploads/${newImage.filename}`;
        console.log("NEW IMAGE PATH", newImagePath);
        database.db.query(
          "UPDATE products SET name = ?, price = ?, description = ?, status = ?, image = ? , subscriptionCategory=? , category=? WHERE id = ?",
          [
            name,
            price,
            description,
            status,
            newImagePath,
            subscriptionCategory,
            category,
            id,
          ],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
              data: {
                id,
                name,
                price,
                description,
                status,
                newImagePath,
                subscriptionCategory,
                category,
              },
            });
          }
        );
      } else {
        database.db.query(
          "UPDATE products SET name = ?, price = ?, description = ?, status = ? , subscriptionCategory = ? ,category=? WHERE id = ?",
          [
            name,
            price,
            description,
            status,
            subscriptionCategory,
            category,
            id,
          ],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
              data: {
                id,
                name,
                price,
                description,
                status,
                subscriptionCategory,
                category,
              },
            });
          }
        );
      }
    }
  );
};

module.exports = {
  getAllProducts,
  getMenProducts,
  getWomenProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
