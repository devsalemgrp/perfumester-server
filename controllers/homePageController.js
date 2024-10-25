const database = require("../models/db");
const path = require("path");
const fs = require("fs");

const welcomeSection = "welcome";
const heroSection = "hero";
const section2Section = "section2";
const ctaSection = "cta";

const HOME_PAGE_TABLE = "homepage";
const IMAGE_PATH = "uploads/homePage/";

const getHomePageData = (req, res) => {
  const response = database.db.query(`SELECT * FROM homepage `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ data: rows });
    }
  });
};

const addWelcomeSectionImage = (req, res) => {
  if (req.file == null) {
    return res.status(400).json({ error: "Please choose an image file" });
  }

  const imagePath = `uploads/homePage/${req.file.filename}`;

  database.db.query(
    `INSERT INTO homepage (section, subsection, content) VALUES (?,?,?)`,
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
    `SELECT content FROM homepage WHERE id = ?`,
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
        `DELETE FROM homepage WHERE id = ?`,
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

const editHeroSectionData = (req, res) => {
  const sections = req.body;

  const updatePromises = sections.map((element) => {
    const { id, subsection, content } = element;

    return new Promise((resolve, reject) => {
      database.db.query(
        `UPDATE homepage SET section = ?, subsection = ?, content = ? WHERE id = ?`,
        [heroSection, subsection, content, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then((results) => {
      res.status(200).json({ message: "Hero Section Updated Successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

const addSection2Image = (req, res) => {
  const imagePath = `${IMAGE_PATH + req.file.filename}`;

  const response = database.db.query(
    `
    INSERT INTO ${HOME_PAGE_TABLE} (section, subsection, content) VALUES (?,?,?)`,
    [section2Section, null, imagePath],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({
          data: {
            id: result.insertId,
            section2Section,
            imagePath,
          },
        });
      }
    }
  );
};

const editSection2Image = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "Please enter an image" });
  }

  database.db.query(
    `
     SELECT content FROM ${HOME_PAGE_TABLE} WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database query error" });
      }
      if (rows.length === 0) {
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

      const newImagePath = `${IMAGE_PATH + req.file.filename}`;
      database.db.query(
        `UPDATE ${HOME_PAGE_TABLE} SET section = ?, subsection = ?, content = ? WHERE id = ?`,
        [section2Section, null, newImagePath, id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          res.status(200).json({ message: "Image Updated Successfully" });
        }
      );
    }
  );
};
const deleteSection2Image = (req, res) => {
  const { id } = req.params;

  database.db.query(
    `SELECT content FROM homepage WHERE id = ?`,
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
        `DELETE FROM homepage WHERE id = ?`,
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

const editCtaData = (req, res) => {
  const sections = req.body;

  if (!sections) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Collect all promises from the queries
  const updatePromises = sections.map((element) => {
    const { id, section, subsection, content } = element;

    if (!id || !section || !content) {
      return Promise.reject({ error: "Missing required fields" });
    }

    return new Promise((resolve, reject) => {
      database.db.query(
        `UPDATE homepage SET section = ?, subsection = ?, content = ? WHERE id = ?`,
        [section, subsection, content, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  // Handle all the promises at once
  Promise.all(updatePromises)
    .then((results) => {
      res.status(200).json({ message: "CTA Section Updated Successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

module.exports = {
  getHomePageData,
  addWelcomeSectionImage,
  deleteWelcomeSectionImage,
  editHeroSectionData,
  addSection2Image,
  editSection2Image,
  deleteSection2Image,
  editCtaData,
};
