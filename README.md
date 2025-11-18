
# 🏏 Cricket Team Management API

A RESTful Node.js + Express API for managing cricket team player data using SQLite.
Supports full CRUD operations—Create, Read, Update, Delete—following clean code and best backend practices.

---

## 🚀 Features

* Fetch all players
* Fetch a player by ID
* Add a new player
* Update an existing player
* Delete a player
* SQLite database integration
* Fully RESTful routes
* Clean folder structure
* Safe and secure SQL queries using `?` placeholders

---

## 🛠️ Tech Stack

| Technology           | Purpose                     |
| -------------------- | --------------------------- |
| **Node.js**          | Server runtime              |
| **Express.js**       | Web framework               |
| **SQLite**           | Lightweight database        |
| **sqlite & sqlite3** | Node SQLite drivers         |
| **REST API**         | Interface for communication |

---

## 📁 Project Structure

```
cricket-team-nodejs-api/
│── app.js
│── cricketTeam.db
│── package.json
│── package-lock.json
│── README.md
```

---

## ⚙️ Installation & Setup

#### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/cricket-team-nodejs-api.git
cd cricket-team-nodejs-api
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Start the server

```bash
node app.js
```

Server starts at:
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🗄️ Database Schema

Table: **cricket_team**

| Column        | Type                              |
| ------------- | --------------------------------- |
| player_id     | INTEGER PRIMARY KEY AUTOINCREMENT |
| player_name   | TEXT                              |
| jersey_number | INTEGER                           |
| role          | TEXT                              |

---

## 📌 API Endpoints

### **1️⃣ Get All Players**

**GET** `/players/`

**Response**

```json
[
  {
    "playerId": 1,
    "playerName": "Lakshman",
    "jerseyNumber": 5,
    "role": "All-rounder"
  }
]
```

---

### **2️⃣ Add a New Player**

**POST** `/players/`

**Body**

```json
{
  "playerName": "Vishal",
  "jerseyNumber": 17,
  "role": "Bowler"
}
```

**Response**

```
Player Added to Team
```

---

### **3️⃣ Get Player by ID**

**GET** `/players/:playerId/`

**Response**

```json
{
  "playerId": 1,
  "playerName": "Lakshman",
  "jerseyNumber": 5,
  "role": "All-rounder"
}
```

---

### **4️⃣ Update Player**

**PUT** `/players/:playerId/`

**Body**

```json
{
  "playerName": "Maneesh",
  "jerseyNumber": 54,
  "role": "All-rounder"
}
```

**Response**

```
Player Details Updated
```

---

### **5️⃣ Delete Player**

**DELETE** `/players/:playerId/`

**Response**

```
Player Removed
```

---

## 🧪 Testing

Use Postman or ThunderClient to test the API.
Example request:

```bash
curl http://localhost:3000/players/
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Boggarapu Venkata Kowshik**
🔗 GitHub: [https://github.com/](https://github.com/)<your-username>

---


