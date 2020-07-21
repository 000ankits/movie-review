const express = require('express'),
	dbconn = require('../DB/conn'),
	session = require('express-session'),
	router = express();

router.use((req, res, next) => {
	res.locals.currentUser = req.session.username;
	next();
});

// ==============================
// Auth Routes
// ==============================

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	if (req.body.password !== req.body.c_password) {
		return res.send('both passwords must be same');
	}
	const sql = {
		text   : `insert into users (username, email, password) values ($1, $2, crypt($3, gen_salt('bf')))`,
		values : [ req.body.username, req.body.email, req.body.password ]
	};

	dbconn
		.query(sql)
		.then((result) => {
			res.redirect('/login');
		})
		.catch((e) => {
			console.log(e.message);
			res.redirect('/register');
		});
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', loginDB, (req, res) => {
	res.redirect('/');
});

router.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

function loginDB(req, res, next) {
	const sql = {
		text   : `select * from users where username = $1 and password = $2`,
		values : [ req.body.username, req.body.password ]
	};
	dbconn
		.query(sql)
		.then((result) => {
			if (result.rowCount === 1) {
				req.session.username = result.rows[0].username;
				return next();
			} else {
				res.redirect('/login');
			}
		})
		.catch((e) => {
			console.log(e.message);
			res.sendStatus(404);
		});
}

module.exports = router;
