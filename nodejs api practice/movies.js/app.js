const express = require("express");
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname,"moviesData.db");
let db = null;

const convertMovieDbObjectToResponseObject = (dbObject) => {
    return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
    
    };
};

const convertDirectorObjectToResponseObject = (dbObject) => {
    return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

const intailizeDb = async() => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000,() => {
            console.log(`Server running at http://localhost:3000/`);
        })
    }catch(e) {
        console.log(`Db error: ${e.message}`);
        process.exit(1);
    }
};

intailizeDb();

//GET method

app.get("/movies/",async(request,response) => {
    const getMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie;`;

    const movies = await db.all(getMoviesQuery);
  const result = movies.map((m) => ({ movieName: m.movie_name }));
  response.send(result);
});

//POST method

app.post("/movies/",async(request,response) => {
    const {directorId,movieName,leadActor} = request.body;

    const insertValues = `
    INSERT INTO
      movie (director_id, movie_name, lead_actor)
    VALUES
      (?, ?, ?);`;

    await db.run(insertValues,[directorId,movieName,leadActor]);
    response.send("Movie Successfully Added");
});

//GET a movie by id

app.get("/movies/:movieId/",async(request,response) => {
    const {movieId} = request.params;

    const getMovieQuerey = `SELECT
      movie_id,
      director_id,
      movie_name,
      lead_actor
    FROM
      movie
    WHERE
      movie_id = ?;`;

    const movie = await db.get(getMovieQuerey,[movieId]);

    if (movie) {
    response.send(convertMovieDbObjectToResponseObject(movie));
  } else {
    response.status(404).send("Movie Not Found");
  }
});

//PUT method

app.put("/movies/:movieId/",async(request,response)=> {
    const {movieId} = request.params;
    const {directorId,movieName,leadActor} = request.body;

    const updateMovieQuerey = `UPDATE
      movie
    SET
      director_id = ?,
      movie_name = ?,
      lead_actor = ?
    WHERE
      movie_id = ?;`;

    await db.run(updateMovieQuerey,[directorId,movieName,leadActor,movieId]);
    response.send("Movie Details Updated");
});

//Delete Method

app.delete("/movies/:movieId/",async(request,response)=> {
    const {movieId} = request.params;

    const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ?;`;

  await db.run(deleteMovieQuery, [movieId]);
  response.send("Movie Removed");
});

//GET Directors by id
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    SELECT movie_name
    FROM movie
    WHERE director_id = ?;`;
  const movies = await db.all(getDirectorMoviesQuery, [directorId]);
  const result = movies.map((m) => ({ movieName: m.movie_name }));
  response.send(result);
});

//GET all directors
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    SELECT
      director_id,
      director_name
    FROM
      director;`;

  const directors = await db.all(getDirectorsQuery);
  const result = directors.map((d) => ({
    directorId: d.director_id,
    directorName: d.director_name,
  }));

  response.send(result);
});

module.exports = app;
