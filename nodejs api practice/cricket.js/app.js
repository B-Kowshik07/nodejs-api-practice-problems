const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Db error: ${e.message}`)
    process.exit(1)
  }
}

intializeDbAndServer()

//GET method

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT
      player_id,
      player_name,
      jersey_number,
      role
    FROM
      cricket_team;`

  const dbplayers = await db.all(getPlayersQuery)

  const result = dbplayers.map(p => ({
    playerId: p.player_id,
    playerName: p.player_name,
    jerseyNumber: p.jersey_number,
    role: p.role,
  }))
  response.send(result)
})

//POST method

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const insertionOfPlayers = `
    INSERT INTO
      cricket_team (player_name, jersey_number, role)
    VALUES
      (?, ?, ?);`

  await db.run(insertionOfPlayers, [playerName, jerseyNumber, role])
  response.send('Player Added to Team')
})

//GET a player by id

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const getQuereyPlayers = `
    SELECT
      player_id,
      player_name,
      jersey_number,
      role
    FROM
      cricket_team
    WHERE
      player_id = ?;`

  const p = await db.get(getQuereyPlayers, [playerId])
  if (p) {
    response.send({
      playerId: p.player_id,
      playerName: p.player_name,
      jerseyNumber: p.jersey_number,
      role: p.role,
    })
  } else {
    response.send('Error')
  }
})

//UPDATE player

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = request.body

  const updateDeatils = `
    UPDATE
      cricket_team
    SET
      player_name = ?,
      jersey_number = ?,
      role = ?
    WHERE
      player_id = ?;`

  await db.run(updateDeatils, [playerName, jerseyNumber, role, playerId])
  response.send('Player Details Updated')
})

//DELETE players from playerid

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuerey = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ?;`

  await db.run(deletePlayerQuerey, [playerId])
  response.send('Player Removed')
})

module.exports = app;
