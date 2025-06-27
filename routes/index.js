var express = require('express');
var router = express.Router();
const authorization = require("../middleware/authorization");

/* Get /movies/search ==> https://localhost:3000/movies/search?title=boys&year=1991 */
router.get("/movies/search", function (req, res, next) {

  // get the queries
  let title = req.query.title;
  let year = req.query.year;
  let page = req.query.page;

  //declare helper functions
  function containsOnlyNumbers(str) { // taken from: https://codingbeautydev.com/blog/javascript-check-if-string-contains-only-numbers/
    return /^\d+$/.test(str);
  }

  //procces title query
  if (title === null) {
    title = "";
  }
  title = `%${title}%`; //for a partial match search
  let pass = false
  if (year === "") {
    year = "";
    pass = true
  }
  else if (year.length !== 4 || containsOnlyNumbers(year) === false) {
    res.status(400).json({ 'error': true, 'message': "Invalid year format. Format must be yyyy." });
  }
  else { pass = true }

  if (pass === true) {
    year = `%${year}%`

    req.db.from('basics').select('primaryTitle AS title', 'year', 'tconst AS imdbID', 'imdbRating',
      'rottentomatoesRating AS rottenTomatoesRating', 'metacriticRating', 'rated AS classification')
      .where('primaryTitle', 'LIKE', title)
      .andWhere('year', 'LIKE', year)
      //.limit(100)
      .then((rows) => {
        const alterdRows = rows.map((rows) => ({
          title: rows.title,
          year: rows.year,
          imdbID: rows.imdbID,
          imdbRating: Number(rows.imdbRating),
          rottenTomatoesRating: Number(rows.rottenTomatoesRating),
          metacriticRating: Number(rows.metacriticRating),
          classification: rows.classification
        }))
        res.json({ "data": alterdRows, "title": title, "year": year, "length": alterdRows.length })
      })
      .catch((err) => {
        console.log(err);
        res.json({ "Error": true, "Message": "Error executing MySQL query" })
      })
  }
});

// Get /movies/data/ ==> https://localhost:3000/movies/data/tt4633694
router.get("/movies/data/:imdbID", function (req, res, next) {
  req.db.from('basics').select('basics.primaryTitle', 'basics.year', 'basics.runtimeMinutes',
    'basics.genres', 'basics.country', 'basics.imdbRating', 'basics.rottentomatoesRating', 'basics.metacriticRating', 'basics.boxoffice',
    'basics.poster', 'basics.plot', 'principals.nconst', 'principals.category', 'principals.name', 'principals.characters')
    .join('principals', 'basics.tconst', '=', 'principals.tconst')
    .where('basics.tconst', '=', req.params.imdbID)
    .then((rows) => {
      if (rows.length === 0) { res.status(404).json({ 'error': true, 'message': "No record exists of a movie with this ID" }) }
      else {
        const formattedRows = {
          title: rows[0].primaryTitle,
          year: rows[0].year,
          runtime: rows[0].runtimeMinutes,
          genres: rows[0].genres.split(","),
          country: rows[0].country,
          principals: rows.map((row) => ({
            id: row.nconst,
            category: row.category,
            name: row.name,
            characters: row.characters ? JSON.parse(row.characters) : []
          })),
          ratings: [
            {
              source: "Internet Movie Database",
              value: Number(rows[0].imdbRating)
            },
            {
              source: "Rotten Tomatoes",
              value: Number(rows[0].rottentomatoesRating)
            },
            {
              source: "Metacritic",
              value: Number(rows[0].metacriticRating)
            }
          ],
          boxoffice: rows[0].boxoffice,
          poster: rows[0].poster,
          plot: rows[0].plot
        }

        res.json(formattedRows)
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ "Error": true, "Message": "Error executing MySQL query" })
    })
});

// /people/{id}
router.get("/people/:id", function (req, res, next) {
  req.db.from('names').select('names.primaryName', 'names.birthYear', 'names.deathYear', 'principals.characters', 'principals.category', 
  'principals.tconst', 'basics.primaryTitle', 'basics.imdbRating')
  .join('principals', 'names.nconst', '=', 'principals.nconst')
  .join('basics', 'principals.tconst', '=', 'basics.tconst')
  .where('names.nconst', '=', req.params.id)
  .then((rows) => {
    if (rows.length === 0) { res.status(404).json({ 'error': true, 'message': "No record exists of a person with this ID" }) }
    else{
    const formattedRows = {
    name: rows[0].primaryName,
    birthYear: rows[0].birthYear,
    deathYear: rows[0].deathYear,
    roles: rows.map((info) => ({
      movieName: info.primaryTitle,
      movieId: info.tconst,
      category: info.category,
      characters: info.characters ? JSON.parse(info.characters) : [],
      imdbRating: info.imdbRating
    }))
  }
    res.json(formattedRows)
    }
  })
  .catch((err) => {
    console.log(err);
    res.json({ "Error": true, "Message": "Error executing MySQL query" })
  })
});

module.exports = router;
