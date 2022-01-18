const { Client } = require('pg');
const implementation = require('./postgres.js');
// Discord-IDs are 18 chars atm (2021) but will increase in the future

const config = {
	host: "localhost",
	user: "nodejs",
	password: "nodejs",
	port: 5432,
	database: "postgres"
}

function getDbImplementation() {
	return implementation;
}

async function prepareDb() {
	return implementation.prepareDb();
}

async function getLanguageCode(serverId) {
	return implementation.getLanguageCode(serverId);
}

async function checkMod() {
	return true;
}
prepareDb().then(res => console.log).catch(err => console.error);

module.exports.getDbImplementation = getDbImplementation;
module.exports.getLanguageCode = getLanguageCode;
module.exports.checkMod = checkMod;
