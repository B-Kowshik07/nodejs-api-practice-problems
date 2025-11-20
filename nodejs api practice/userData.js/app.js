const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "userData.db");
let db = null;

const initializeDbAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      username TEXT PRIMARY KEY,
      name TEXT,
      password TEXT,
      gender TEXT,
      location TEXT
    );
  `);

  if (require.main === module) {
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  }
};

initializeDbAndServer();

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;

  const existingUser = await db.get(
    `SELECT username FROM user WHERE username = ?;`,
    [username]
  );

  if (existingUser) {
    response.status(400).send("User already exists");
    return;
  }

  if (password.length < 5) {
    response.status(400).send("Password is too short");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.run(
    `
    INSERT INTO user (username, name, password, gender, location)
    VALUES (?, ?, ?, ?, ?);
  `,
    [username, name, hashedPassword, gender, location]
  );

  response.status(200).send("User created successfully");
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  const user = await db.get(`SELECT * FROM user WHERE username = ?;`, [
    username,
  ]);

  if (!user) {
    response.status(400).send("Invalid user");
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    response.status(400).send("Invalid password");
    return;
  }

  response.status(200).send("Login success!");
});

app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;

  const user = await db.get(`SELECT * FROM user WHERE username = ?;`, [
    username,
  ]);

  if (!user) {
    response.status(400).send("Invalid current password");
    return;
  }

  const isOldPasswordValid = await bcrypt.compare(
    oldPassword,
    user.password
  );

  if (!isOldPasswordValid) {
    response.status(400).send("Invalid current password");
    return;
  }

  if (newPassword.length < 5) {
    response.status(400).send("Password is too short");
    return;
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await db.run(
    `UPDATE user SET password = ? WHERE username = ?;`,
    [hashedNewPassword, username]
  );

  response.status(200).send("Password updated");
});

module.exports = app;
