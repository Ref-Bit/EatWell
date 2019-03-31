var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
  user: 'Refaat',
  database: 'recipebook',
  password: 'secret',
  port: 5432,
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.connect(function (err, client, done) {
    if (err){
      return console.log('error fetching client from pool', err);
    }
    client.query('SELECT * FROM recipes', function (err, result) {
      done();
      if (err){
        return console.log('error running query');
      }
      res.render('index', { title: 'EatWell', recipes: result.rows });
    });
  });
});

router.post('/add', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err){
      return console.log('error fetching client from pool', err);
    }
    client.query('INSERT INTO recipes(name, ingredients, directions, price) VALUES($1,$2,$3,$4)',
                  [req.body.name, req.body.ingredients, req.body.directions, req.body.price]);
      done();
      res.redirect('/');
  });
});

router.post('/edit', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err){
      return console.log('error fetching client from pool', err);
    }
    client.query('UPDATE recipes SET name = $1, ingredients = $2, price = $3, directions = $4 WHERE id = $5',
        [req.body.name, req.body.ingredients, req.body.price, req.body.directions, req.body.id]);
    done();
    res.redirect('/');
  });
});

router.post('/delete/:id', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err){
      return console.log('error fetching client from pool', err);
    }
    client.query('DELETE FROM recipes WHERE id = $1', [req.body.id]);
    done();
    res.redirect('/');
  });
});


module.exports = router;
