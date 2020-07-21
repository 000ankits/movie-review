const express = require('express'),
	bodyparser = require('body-parser'),
	session = require('express-session'),
	dotEnv = require('dotenv'),
	flash = require('connect-flash'),
	dbconn = require('./DB/conn'),
	methodOverride = require('method-override');

const app = express();

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

dotEnv.config({ path: './.env' });
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(session({ secret: 'Password Encryption', resave: false, saveUninitialized: false }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/', authRoutes);
app.use('/', searchRoutes);
app.use((req, res, next) => {
	res.locals.currentUser = req.session.username;
	next();
});

dbconn.connect();
const port = process.env.PORT || 8888;

// ==============================
// Routes
// ==============================
app.get('/', (req, res) => {
	res.redirect('/searchmovie');
});

app.listen(port, () => {
	console.log('Server started on ', port, '...');
});
