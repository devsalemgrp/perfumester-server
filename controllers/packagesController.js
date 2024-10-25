const database = require("../models/db");

const getAllPackages = (req, res) => {
  console.log("Retrieving Products");
  const response = database.db.query("SELECT * FROM packages", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ data: rows });
    }
  });
};

const editPackage = (req, res) => {
  const { id, title, description, subscription_type } = req.body;

  if (!title || !description || !subscription_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const findPackage = database.db.query(
    "SELECT * FROM packages WHERE id = ?",
    [id],
    (error, rows) => {
      if (error) {
        // Handle SQL error
        return res.status(500).json({ error: error.message });
      } else if (rows.length === 0) {
        // Handle case when package is not found
        return res.status(404).json({ error: "Package not found" });
      } else {
        // If package is found, proceed to update it
        const updatePackage = database.db.query(
          "UPDATE packages SET title = ?, description = ?, subscription_type = ? WHERE id = ?",
          [title, description, subscription_type, id],
          (err) => {
            if (err) {
              // Handle update error
              return res.status(500).json({ error: err.message });
            } else {
              // If successful, send the updated data as response
              const message = "Package updated successfully!";
              return res.status(200).json({
                data: {
                  id,
                  title,
                  description,
                  subscription_type,
                  message,
                },
              });
            }
          }
        );
      }
    }
  );
};

const editPackageActivity = (req, res) => {
  const { id, status } = req.body;

  // Check for missing required fields
  if (!id || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Find the package by ID
  database.db.query(
    "SELECT * FROM packages WHERE id = ?",
    [id],
    (error, rows) => {
      if (error) {
        // Handle SQL error
        return res.status(500).json({ error: error.message });
      } else if (rows.length === 0) {
        // Handle case when package is not found
        return res.status(404).json({ error: "Package not found" });
      } else {
        // If package is found, proceed to update it
        database.db.query(
          "UPDATE packages SET status = ? WHERE id = ?",
          [status, id],
          (err) => {
            if (err) {
              // Handle update error
              return res.status(500).json({ error: err.message });
            } else {
              // If successful, send the updated status
              const message = "Package status updated successfully!";
              return res.status(200).json({
                data: { id, status, message },
              });
            }
          }
        );
      }
    }
  );
};

module.exports = {
  getAllPackages,
  editPackageActivity,
  editPackage,
};
