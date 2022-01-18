const { Client } = require('pg');
const fs = require('fs');

const config = {
	idleTimeoutMillis: 10000,
	host: process.env['POSTGRES_HOST'],
	user: process.env['POSTGRES_USERNAME'],
	password: process.env['POSTGRES_PASSWORD'],
	port: parseInt(process.env['POSTGRES_PORT']),
	database: process.env['POSTGRES_DATABASE']
}

async function prepareDb() {
	let result = [];
	let client = new Client(config);
	result.push(await client.connect());
	// View tables: SELECT * FROM information_schema.tables
	// Changing Database is not supported by PostgreSQL so the Database 'pokebot' needs to be existing before executing
	result.push(await client.query('CREATE TABLE IF NOT EXISTS mods (serverId VARCHAR(30), mentionableId VARCHAR(30), isUser BOOLEAN);'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS channels (serverId VARCHAR(30), channelId VARCHAR(30));'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS tempPokemon (tempPokemonId INT, pokemonId VARCHAR(100), serverId VARCHAR(30));'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS score (serverId VARCHAR(30), userId VARCHAR(30), score INT);'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS pokemon (pokemonId INT, userId VARCHAR(30), quantity INT);'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS pokemonMap (pokemonId INT, pokemonName VARCHAR(100), languageName VARCHAR(100));'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS language (serverId VARCHAR(30), languageCode VARCHAR(5));'));
	result.push(await client.end());
	return result;
}

async function getLanguageCode(serverId) {
	let result = [];
	let client = new Client(config);
	await client.connect();
	result = await client.query('SELECT languageCode FROM language WHERE serverId = $1;', [serverId]).then(res => res.rows);
	if (result.length < 1)
		result = 'en_US';
	await client.end();
	return result;
}

function getLanguages() {
	return new Promise((resolve, reject) => {
		return fs.readdir('./languages', (err, filenames) => {
			if (err != null) {
				reject(err)
			} else {
				for (let i = 0; i < filenames.length; i++)
					filenames[i] = filenames[i].substring(0, filenames[i].lastIndexOf('.'));
				resolve(filenames);
			}
		});
	});
}

function getLanguageObject(language = 'en_US') {
	return require(`./languages/${language}.json`);
}

async function checkMod() {
	return true; // TODO
}
prepareDb().then(res => console.log).catch(err => console.error);

module.exports.checkMod = checkMod;
module.exports.getLanguageCode = getLanguageCode;
module.exports.getLanguages = getLanguages;
module.exports.getLanguageObject = getLanguageObject;
module.exports.checkMod = checkMod;
