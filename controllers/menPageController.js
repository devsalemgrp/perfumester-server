const database = require("../models/db");
const path = require("path");
const fs = require("fs");

const MENS_PAGE_TABLE = "menspage";
const homeSection = "home";
const recommendedSection = "recommended";
const specialPerfumes = "special_perfumes";
const specialBackgrounds = "special_backgrounds";
const IMAGE_PATH = "uploads/womenPage/";

const getMensPageData = (req, res) => {
  const response = database.db.query(
    `SELECT * FROM ${MENS_PAGE_TABLE}`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ data: rows });
      }
    }
  );
};

const addHomeImage = (req, res) => {
  if (req.file == null) {
    return res.status(400).json({ error: "Please choose an image file" });
  }

  const imagePath = `${IMAGE_PATH + req.file.filename}`;

  database.db.query(
    `INSERT INTO ${MENS_PAGE_TABLE} (section, subsection, content) VALUES (?,?,?)`,
    [homeSection, null, imagePath],
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

const deleteHomeImage = (req, res) => {
  const { id } = req.params;
  database.db.query(
    `SELECT content FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
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
        fs.unlink(fullImagePath, (err) => {
          if (err) {
            return res.status(500).json({ error: "Error deleting image" });
          }
        });
      }

      database.db.query(
        `DELETE FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
        [id],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error deleting image from database" });
          }

          res.status(200).json({ message: "Image deleted successfully" });
        }
      );
    }
  );
};

const addRecommendedImage = (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: " Please enter an Image file" });
  }

  const imagePath = `${IMAGE_PATH + req.file.filename}`;

  database.db.query(
    `INSERT INTO ${MENS_PAGE_TABLE} (section , subsection,content) VALUES(?,?,?)`,
    [recommendedSection, null, imagePath],
    (err, row) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      } else {
        return res.status(200).json({ message: "Image uploaded successfully" });
      }
    }
  );
};
const deleteRecommendedImage = (req, res) => {
  const { id } = req.params;

  database.db.query(
    `SELECT * FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const imagePath = rows[0].content;
      const fullImagePath = path.join(__dirname, "..", imagePath);

      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath, (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
        });
      }

      database.db.query(
        `DELETE FROM ${MENS_PAGE_TABLE} WHERE id=? `,
        [id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          return res
            .status(200)
            .json({ message: "Image deleted successfully" });
        }
      );
    }
  );
};
const updateRecommendedImage = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(404).json({ message: "Please Enter an Image file " });
  }

  database.db.query(
    `SELECT * FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database query error ..." });
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: " Couldn't find Product" });
      }

      const imagePath = rows[0].content;

      const fullImagePath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullImagePath)) {
        fs.unlink(fullImagePath, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error in deleting image from server " });
          }
        });
      }

      const newPath = `${IMAGE_PATH + req.file.filename}`;

      database.db.query(
        `UPDATE ${MENS_PAGE_TABLE} SET section = ?, subsection = ?, content = ? WHERE id = ?`,
        [recommendedSection, null, newPath, id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          } else {
            return res
              .status(200)
              .json({ message: "Image updated successfully" });
          }
        }
      );
    }
  );
};

const addSpecialPerfumeImage = (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: " Please enter an Image file" });
  }

  const imagePath = `${IMAGE_PATH + req.file.filename}`;

  database.db.query(
    `INSERT INTO ${MENS_PAGE_TABLE} (section , subsection,content) VALUES(?,?,?)`,
    [specialPerfumes, null, imagePath],
    (err, row) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      } else {
        return res.status(200).json({ message: "Image uploaded successfully" });
      }
    }
  );
};
const deleteSpecialPerfumeImage = (req, res) => {
  const { id } = req.params;

  database.db.query(
    `SELECT * FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const imagePath = rows[0].content;
      const fullImagePath = path.join(__dirname, "..", imagePath);

      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath, (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
        });
      }

      database.db.query(
        `DELETE FROM ${MENS_PAGE_TABLE} WHERE id=? `,
        [id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          return res
            .status(200)
            .json({ message: "Image deleted successfully" });
        }
      );
    }
  );
};
const updateSpecialPerfumeImage = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(404).json({ message: "Please Enter an Image file " });
  }

  database.db.query(
    `SELECT * FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database query error ..." });
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: " Couldn't find Product" });
      }

      const imagePath = rows[0].content;

      const fullImagePath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullImagePath)) {
        fs.unlink(fullImagePath, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error in deleting image from server " });
          }
        });
      }

      const newPath = `${IMAGE_PATH + req.file.filename}`;

      database.db.query(
        `UPDATE ${MENS_PAGE_TABLE} SET section = ?, subsection = ?, content = ? WHERE id = ?`,
        [specialPerfumes, null, newPath, id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          } else {
            return res
              .status(200)
              .json({ message: "Image updated successfully" });
          }
        }
      );
    }
  );
};

const addSpecialBackgroundImage = (req, res) => {
  if (req.file == null) {
    return res.status(400).json({ error: "Please choose an image file" });
  }

  const imagePath = `${IMAGE_PATH + req.file.filename}`;

  database.db.query(
    `INSERT INTO ${MENS_PAGE_TABLE} (section, subsection, content) VALUES (?,?,?)`,
    [specialBackgrounds, null, imagePath],
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

const deleteSpecialBackgroundImage = (req, res) => {
  const { id } = req.params;
  database.db.query(
    `SELECT content FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
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
        fs.unlink(fullImagePath, (err) => {
          if (err) {
            return res.status(500).json({ error: "Error deleting image" });
          }
        });
      }

      database.db.query(
        `DELETE FROM ${MENS_PAGE_TABLE} WHERE id = ?`,
        [id],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error deleting image from database" });
          }

          res.status(200).json({ message: "Image deleted successfully" });
        }
      );
    }
  );
};

module.exports = {
  getMensPageData,
  addHomeImage,
  deleteHomeImage,

  addRecommendedImage,
  deleteRecommendedImage,
  updateRecommendedImage,

  addSpecialPerfumeImage,
  deleteSpecialPerfumeImage,
  updateSpecialPerfumeImage,

  addSpecialBackgroundImage,
  deleteSpecialBackgroundImage,
};
