const database = require("../models/db");

const getAllSubscriptions = (req, res) => {
  const subscriptions = database.db.query(
    "SELECT * FROM subscriptions",
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

const createSubscription = (req, res) => {
  const { personName, subscription_type, date, price, status } = req.body;
  if (!personName || !subscription_type || !date || !price || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newSubscription = database.db.query(
    "INSERT INTO subscriptions (personName, subscription_type, date, price, status) VALUES (?,?,?,?,?)",
    [personName, subscription_type, date, price, status],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({
          data: {
            id: result.insertId,
            personName,
            subscription_type,
            date,
            price,
            status,
          },
        });
      }
    }
  );
};

const editSubscriptionActivity = (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const findSubscription = database.db.query(
    "SELECT * FROM subscriptions WHERE id= ?",
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else if (rows.length === 0) {
        return res.status(404).json({ error: "Subscription not found" });
      } else {
        const updateSubscription = database.db.query(
          "UPDATE subscriptions SET status = ? WHERE id = ?",
          [status, id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            } else {
              const message = "Subscription updated successfully!";
              return res.status(200).json({ data: { id, status, message } });
            }
          }
        );
      }
    }
  );
};

module.exports = {
  getAllSubscriptions,
  createSubscription,
  editSubscriptionActivity,
};
