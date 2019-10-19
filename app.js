const express = require('express'),
	dotEnv = require('dotenv'),
	bodyparser = require('body-parser'),
	methodOverride = require('method-override');
app = express();

dotEnv.config({ path: './.env' });
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

const port = process.env.PORT || 8888;

// ==============================
// Routes
// ==============================
app.get('/', (req, res) => {
	res.render('index');
});

app.listen(port, () => {
	console.log('Server started on ', port, '...');
});
