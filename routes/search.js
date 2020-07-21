const express = require('express'),
	superAgent = require('superagent'),
	dotEnv = require('dotenv'),
	dbconn = require('../DB/conn'),
	router = express();

dotEnv.config({ path: './.env' });
router.use((req, res, next) => {
	res.locals.currentUser = req.session.username;
	next();
});

let results = [];

router.get('/searchmovie', (req, res) => {
	res.render('search');
});

router.post('/searchmovie', (req, res) => {
	superAgent
		.post('http://www.omdbapi.com/?apikey=' + process.env.apiKey + '&s=' + req.body.name + '&type=' + req.body.type)
		.then((result) => {
			let data = JSON.parse(result.text);
			results = data.Search;
			req.session.results = results;
			return res.redirect('/results');
			// return res.send(data);
		})
		.catch((e) => {
			console.log(e);
			return res.send(e.message);
		});
});

router.get('/results', (req, res) => {
	if (req.session.results === undefined) {
		return res.sendStatus(404);
	}
	res.render('results', { results: req.session.results });
});

router.get('/results/:title', (req, res) => {
	superAgent
		.post('http://www.omdbapi.com/?apikey=' + process.env.apiKey + '&i=' + req.params.title)
		.then((result) => {
			let title = JSON.parse(result.text);
			const sql = {
				text   : `select * from reviews where movieId = $1`,
				values : [ req.params.title ]
			};

			dbconn
				.query(sql)
				.then((data) => {
					let reviews = data.rows;
					return res.render('titlePage', { title, reviews });
				})
				.catch((e) => {
					console.log(e.message);
					return res.sendStatus(404);
				});
		})
		.catch((e) => {
			console.log(e);
			return res.sendStatus(404);
		});
});

// ========================
// Create Review Route
// ========================

router.post('/createReview/:title', isLoggedIn, (req, res) => {
	const reviewText = req.body.reviewText;
	const sql = {
		text   : `insert into reviews (text, movieId, username) values ($1, $2, $3)`,
		values : [ reviewText, req.params.title, 'test1' ]
	};

	dbconn
		.query(sql)
		.then((result) => {
			console.log('review created!');
			return res.redirect('/results/' + req.params.title);
		})
		.catch((e) => {
			console.log(e.message);
			return res.sendStatus(404);
		});
});

function isLoggedIn(req, res, next) {
	if (req.session.username) {
		return next();
	} else {
		res.redirect('/login');
	}
}

module.exports = router;
