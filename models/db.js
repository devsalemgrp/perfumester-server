//Database Connection
const mysql2 = require("mysql2");
const dbConnection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "perfumester",
});

dbConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// dbConnection.query(createSubscriptionsTable, (err, result) => {
//   if (err) {
//     console.log("Error creating subscriptions table", err);
//   } else {
//     console.log("Subscriptions table created successfully");
//   }
// });

module.exports = { db: dbConnection };
