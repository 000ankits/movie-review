const { Client } = require('pg'),
	dotEnv = require('dotenv');

dotEnv.config({ path: './.env' });

const dbconn = new Client({
	connectionString : process.env.DATABASE_URL,
	ssl              : {
		rejectUnauthorized : false
	}
});

module.exports = dbconn;
