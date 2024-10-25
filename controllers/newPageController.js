const database = require("../models/db");
const path = require("path");
const fs = require("fs");

const NEW_PAGE_TABLE = "newPage";
const welcomeSection = "welcome";
const IMAGE_PATH = "uploads/newPage/";
const getNewPageData = (req, res) => {
  const response = database.db.query(
    `SELECT * FROM ${NEW_PAGE_TABLE} `,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ data: rows });
      }
    }
  );
};

const addWelcomeSectionImage = (req, res) => {
  if (req.file == null) {
    return res.status(400).json({ error: "Please choose an image file" });
  }

  const imagePath = `${IMAGE_PATH + req.file.filename}`;

  database.db.query(
    `INSERT INTO ${NEW_PAGE_TABLE} (section, subsection, content) VALUES (?,?,?)`,
    [welcomeSection, null, imagePath],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({
          data: {
            id: result.insertId,
            imagePath,
          },
        });
      }
    }
  );
};

const deleteWelcomeSectionImage = (req, res) => {
  const { id } = req.params;

  database.db.query(
    `SELECT content FROM ${NEW_PAGE_TABLE} WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database query error" });
      }
      if (rows.length == 0) {
        return res.status(404).json({ error: "PRODUCT NOT FOUND" });
      }

      const imagePath = rows[0].content;
      const fullImagePath = path.join(__dirname, "..", imagePath);

      if (fs.existsSync(fullImagePath)) {
        fs.unlink(fullImagePath, (unLinkErr) => {
          if (unLinkErr) {
            console.log("ERROR DELETING IMAGE __", unLinkErr);
          }
        });
      }

      database.db.query(
        `DELETE FROM ${NEW_PAGE_TABLE} WHERE id = ?`,
        [id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          res.status(200).json({ message: "Image Deleted Successfully" });
        }
      );
    }
  );
};

module.exports = {
  getNewPageData,
  addWelcomeSectionImage,
  deleteWelcomeSectionImage,
};
