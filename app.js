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
	const apiKey = process.env.apiKey;
	superAgent
		.post('http://www.omdbapi.com/?apikey=' + apiKey + '&s=' + req.body.name + '&type=' + req.body.type)
		.then((result) => {
			let data = JSON.parse(result.text);
			return res.render('results', { results: data.Search });
			// return res.send(data);
		})
		.catch((e) => {
			console.log(e);
			return res.send(e.message);
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
