const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketMatchDetails.db')
let db = null

const intializeDbserver = async () => {
  try {
    db = await open({
      filename : dbPath,
      driver : sqlite3.Database,
    })
    if (require.main === module) {
      app.listen(3000, (request, response) => {
        console.log('Server running at http://localhost:3000/')
      })
    }
  } catch (e) {
    console.error(`DB error ${e.message}`)
  }
}

intializeDbserver()

const convertPlayerDbToResponse = playerRow => ({
  playerId: playerRow.player_id,
  playerName: playerRow.player_name,
})

const convertMatchDbToResponse = matchRow => ({
  matchId: matchRow.match_id,
  match: matchRow.match,
  year: matchRow.year,
})

//return all players

app.get('/players/', async (request, response) => {
  const query = `
    SELECT player_id, player_name
    FROM player_details;`
  const players = await db.all(query)
  response.send(players.map(p => convertPlayerDbToResponse(p)))
})

//get player by playerid

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `
    SELECT player_id, player_name
    FROM player_details
    WHERE player_id = ?;`
  const player = await db.get(query, [playerId])
  response.send(convertPlayerDbToResponse(player))
})

//update player

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const {playerName} = request.body
  const updateQuery = `
    UPDATE player_details
    SET player_name = ?
    WHERE player_id = ?;`
  await db.run(updateQuery, [playerName,playerId])
  response.send('Player Details Updated')
})

// match details by id

app.get('/matches/:matchId/', async (request, response) => {
  const {matchId} = request.params
  const query = `
    SELECT match_id, match, year
    FROM match_details
    WHERE match_id = ?;`
  const matchRow = await db.get(query, [matchId])
  if (matchRow) {
    response.send(convertMatchDbToResponse(matchRow))
  } else {
    response.status(404).send('Match Not Found')
  }
})

//get matches played by a player

app.get('/players/:playerId/matches/', async (request, response) => {
  const { playerId } = request.params;
  const playerMatchesQuery = `
    SELECT match_id as matchId, match, year
    FROM player_match_score NATURAL JOIN match_details
    WHERE player_id = ?;`
  const matches = await db.all(playerMatchesQuery, [playerId]);
  response.send(matches);
});


//get all players in a match

app.get('/matches/:matchId/players', async (request, response) => {
  const {matchId} = request.params
  const playersquerey = `SELECT
    player_match_score.player_id AS playerId,
    player_name AS playerName
    FROM
    player_details INNER JOIN player_match_score ON player_details.player_id = player_match_score.player_id
    WHERE
    match_id = ?`

  const players = await db.all(playersquerey, [matchId])
  response.send(players)
})

//total sixes,fours and total score by a player

app.get('/players/:playerId/playerScores', async (request, response) => {
  const { playerId } = request.params
  const query = `
    SELECT
      pd.player_id AS playerId,
      pd.player_name AS playerName,
      SUM(pms.score) AS totalScore,
      SUM(pms.fours) AS totalFours,
      SUM(pms.sixes) AS totalSixes
    FROM player_details pd
    LEFT JOIN player_match_score pms ON pd.player_id = pms.player_id
    WHERE pd.player_id = ?
    GROUP BY pd.player_id;`
  const row = await db.get(query, [playerId])

  if (row) {
    const result = {
      playerId: row.playerId,
      playerName: row.playerName,
      totalScore: row.totalScore === null ? 0 : row.totalScore,
      totalFours: row.totalFours === null ? 0 : row.totalFours,
      totalSixes: row.totalSixes === null ? 0 : row.totalSixes,
    }
    response.send(result)
  } else {
    response.status(404).send('Player Not Found')
  }
});

module.exports = app;
