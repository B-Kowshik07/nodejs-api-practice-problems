
# 🎬 Movies & Directors API

A simple and efficient REST API built using **Express.js** and **SQLite** to manage movies, directors, and their relationships.
This project includes full CRUD functionality for movies and read operations for directors, making it ideal for learning backend development.

---

## 🌟 Features

* Fetch all movies
* Add a new movie
* Retrieve a movie by its ID
* Update movie details
* Delete a movie
* Fetch all directors
* Fetch movies belonging to a specific director

---

## 🧱 Tech Stack

* **Node.js**
* **Express.js**
* **SQLite (sqlite3 + sqlite)**
* **REST API Architecture**

---

## 📂 Project Setup

1. Install Node.js on your machine.
2. Install all dependencies using npm.
3. Create a SQLite database named `moviesData.db`.
4. Add the required tables:

   * `director`
   * `movie`
5. Insert sample data (optional but recommended).
6. Run the server using Node.
7. Test the routes using Postman, cURL, or your browser.

---

## 📡 API Endpoints

### Movies

* **GET /movies/** – Get a list of all movies
* **POST /movies/** – Add a new movie
* **GET /movies/:movieId/** – Get details of a specific movie
* **PUT /movies/:movieId/** – Update movie details
* **DELETE /movies/:movieId/** – Delete a movie

### Directors

* **GET /directors/** – Get a list of all directors
* **GET /directors/:directorId/movies/** – Get all movies made by a specific director

---

## 🗂 Project Structure

* `app.js` – All API logic
* `moviesData.db` – SQLite database
* `README.md` – Project documentation

---

## 🎯 Learning Goals

This project helps you understand:

* Building REST APIs with Express
* Connecting Express with SQLite
* Writing SQL queries using sqlite3 and sqlite libraries
* Handling CRUD operations
* Creating clean API route structures
* Sending formatted responses to match expected outputs

---

## 📌 Notes

* Ensure the SQLite DB is in the same folder as `app.js`.
* API responses match NxtWave/CCBP test cases.
* Designed for easy extension (add genres, ratings, etc.).

---

