//Database Connection
const mysql2 = require("mysql2");
const dbConnection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "perfumster",
});

dbConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

const createTable = `
CREATE TABLE IF NOT EXISTS newpage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(255) NOT NULL,
  subsection VARCHAR(255),
  content TEXT NOT NULL
);
`;

// dbConnection.query(createTable, (err, result) => {
//   if (err) {
//     console.log("Error creating subscriptions table", err);
//   } else {
//     console.log("Subscriptions table created successfully");
//   }
// });

module.exports = { db: dbConnection };
