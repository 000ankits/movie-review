const express = require('express'),
	dotEnv = require('dotenv'),
	bodyparser = require('body-parser'),
	{ Client } = require('pg'),
	session = require('express-session'),
	flash = require('connect-flash'),
	superAgent = require('superagent'),
	methodOverride = require('method-override');

const app = express();

dotEnv.config({ path: './.env' });
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(session({ secret: 'Password Encryption', resave: false, saveUninitialized: false }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

const dbconn = new Client({
	connectionString : process.env.DATABASE_URL,
	ssl              : {
		rejectUnauthorized : false
	}
});

const port = process.env.PORT || 8888;
const apiKey = process.env.apiKey; //OMDB API Key
let results = [];

dbconn.connect();

// ==============================
// Routes
// ==============================
app.get('/', (req, res) => {
	res.redirect('/searchmovie');
});

app.get('/searchmovie', (req, res) => {
	res.render('search');
});

app.post('/searchmovie', (req, res) => {
	superAgent
		.post('http://www.omdbapi.com/?apikey=' + apiKey + '&s=' + req.body.name + '&type=' + req.body.type)
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

app.get('/results', (req, res) => {
	if (req.session.results === undefined) {
		return res.sendStatus(404);
	}
	res.render('results', { results: req.session.results });
});

app.get('/results/:title', (req, res) => {
	superAgent
		.post('http://www.omdbapi.com/?apikey=' + apiKey + '&i=' + req.params.title)
		.then((result) => {
			let title = JSON.parse(result.text);
			const sql = {
				text   : `select * from comments where movieId = $1`,
				values : [ req.params.title ]
			};
			dbconn
				.query(sql)
				.then((data) => {
					let comments = data.rows;
					return res.render('titlePage', { title, comments });
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

app.post('/createComment/:title', (req, res) => {
	const commentText = req.body.commentText;
	const sql = {
		text   : `insert into comments (text, movieId, username) values ($1, $2, $3)`,
		values : [ commentText, req.params.title, 'test1' ]
	};

	dbconn
		.query(sql)
		.then((result) => {
			console.log('comment created!');
			return res.redirect('/results/' + req.params.title);
		})
		.catch((e) => {
			console.log(e.message);
			return res.sendStatus(404);
		});
});

// ==============================
// Auth Routes
// ==============================

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	res.send(req.body);
});

app.listen(port, () => {
	console.log('Server started on ', port, '...');
});
