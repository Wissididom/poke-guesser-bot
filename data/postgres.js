const { Client } = require('pg');
const fs = require('fs');
const language = require('./../language.js');
const util = require('./../util.js');
// Discord-IDs are 18 chars atm (2021) but will increase in the future

const config = {
	idleTimeoutMillis: 10000,
	host: process.env['POSTGRES_HOST'],
	user: process.env['POSTGRES_USERNAME'],
	password: process.env['POSTGRES_PASSWORD'],
	port: parseInt(process.env['POSTGRES_PORT']),
	database: process.env['POSTGRES_DATABASE']
}

const client = new Client(config);

async function connect() {
	await client.connect();
}

async function prepareDb() {
	let result = [];
	// View tables: SELECT * FROM information_schema.tables
	// Changing Database is not supported by PostgreSQL so the Database 'pokebot' needs to be existing before executing
	result.push(await client.query('CREATE TABLE IF NOT EXISTS mods (serverId VARCHAR(30), mentionableId VARCHAR(30), isUser BOOLEAN);'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS channels (serverId VARCHAR(30), channelId VARCHAR(30));'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS tempPokemon (tempPokemonId INT, pokemonId VARCHAR(100), serverId VARCHAR(30));'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS score (serverId VARCHAR(30), userId VARCHAR(30), score INT);'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS pokemon (pokemonId INT, userId VARCHAR(30), quantity INT);'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS pokemonMap (pokemonId INT, pokemonName VARCHAR(100), languageName VARCHAR(100));'));
	result.push(await client.query('CREATE TABLE IF NOT EXISTS language (serverId VARCHAR(30), languageCode VARCHAR(5));'));
	// result.push(await client.query('CREATE TABLE IF NOT EXISTS delays (serverId VARCHAR(30), userId VARCHAR(30));')); TODO Include Time
	// result.push(await client.query('CREATE TABLE IF NOT EXISTS timeouts (serverId VARCHAR(30), userId VARCHAR(30));')); TODO Include Time
	return result;
}

async function addMod(mentionable) {
	const lang = await language.getLanguage(mentionable.guild.id, {
		getLanguageCode
	});
	let result = [];
	if (await isMod(mentionable))
		throw util.isUser(mentionable) ? lang.obj['settings_mods_add_already_existing_user'].replace('{mentionable}', `<@!${mentionable.userId || mentionable.id}>`) : lang.obj['settings_mods_add_already_existing_role'].replace('{mentionable}', `<@&${mentionable.userId || mentionable.id}>`);
	else
		result.push(await client.query('INSERT INTO mods (serverId, mentionableId, isUser) VALUES ($1, $2, $3);', [mentionable.guild.id, mentionable.userId || mentionable.id, util.isUser(mentionable)]));
	return result;
}

async function removeMod(mentionable) {
	const lang = await language.getLanguage(mentionable.guild.id, {
		getLanguageCode
	});
	let result = [];
	if (!(await isMod(mentionable)))
		throw util.isUser(mentionable) ? lang.obj['settings_mods_remove_not_existing_mod_user'].replace('{mentionable}', `<@!${mentionable.userId || mentionable.id}>`) : lang.obj['settings_mods_remove_not_existing_mod_role'].replace('{mentionable}', `<@&${mentionable.userId || mentionable.id}>`);
	else
		result.push(await client.query('DELETE FROM mods WHERE serverId = $1 AND mentionableId = $2;', [mentionable.guild.id, mentionable.userId || mentionable.id]));
	return result;
}

async function listMods(serverId) {
	return await client.query('SELECT * FROM mods WHERE serverId = $1;', [serverId]).then(res => res.rows);
}

async function isMod(mentionable) {
	return await client.query('SELECT * FROM mods WHERE serverId = $1 AND mentionableId = $2;', [mentionable.guild.id, mentionable.userId || mentionable.id]).then(res => res.rows).then(rows => rows.length > 0);
}

async function resetMods(serverId) {
	let result = [];
	result.push(await client.query('DELETE FROM mods WHERE serverId = $1;', [serverId]));
	return result;
}

async function addChannel(channel) {
	const lang = await language.getLanguage(channel.guildId, {
		getLanguageCode
	});
	let result = [];
	if (await isAllowedChannel(channel))
		throw lang.obj['settings_channels_add_already_allowed'].replace('{channel}', `<#${channel.id}>`);
	else
		result.push(await client.query('INSERT INTO channels (serverId, channelId) VALUES ($1, $2);', [channel.guildId, channel.id]));
	return result;
}

async function removeChannel(channel) {
	const lang = await language.getLanguage(channel.guildId, {
		getLanguageCode
	});
	let result = [];
	if (!(await isAllowedChannel(channel)))
		throw lang.obj['settings_channels_remove_not_allowed'].replace('{channel}', `<#${channel.id}>`);
	else
		result.push(await client.query('DELETE FROM channels WHERE serverId = $1 AND channelId = $2;', [channel.guildId, channel.id]));
	return result;
}

async function listChannels(serverId) {
	return await client.query('SELECT * FROM channels WHERE serverId = $1;', [serverId]).then(res => res.rows);
}

async function isAllowedChannel(channel) {
	return await client.query('SELECT * FROM channels WHERE serverId = $1 AND channelId = $2;', [channel.guildId, channel.id]).then(res => res.rows).then(rows => rows.length > 0);
}

async function resetChannels(serverId) {
	let result = [];
	result.push(await client.query('DELETE FROM channels WHERE serverId = $1;', [serverId]));
	return result;
}

async function setLanguage(serverId, languageCode) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	let result = [];
	if (await isLanguageSet(serverId, languageCode))
		throw lang.obj['settings_language_set_already_set'].replace('{language}', languageCode);
	else if (await isAnyLanguageSet(serverId))
		result.push(await client.query('UPDATE language SET languageCode = $2 WHERE serverId = $1', [serverId, languageCode]));
	else
		result.push(await client.query('INSERT INTO language (serverId, languageCode) VALUES ($1, $2);', [serverId, languageCode]));
	return result;
}

async function unsetLanguage(serverId) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	let result = [];
	if (await isAnyLanguageSet(serverId))
		result.push(await client.query('DELETE FROM language WHERE serverId = $1', [serverId]));
	else
		throw lang.obj['settings_language_unset_not_set'];
	return result;
}

async function isLanguageSet(serverId, languageCode) {
	return await client.query('SELECT * FROM language WHERE serverId = $1 AND languageCode = $2;', [serverId, languageCode]).then(res => res.rows).then(rows => rows.length > 0);
}

async function isAnyLanguageSet(serverId) {
	return await client.query('SELECT * FROM language WHERE serverId = $1;', [serverId]).then(res => res.rows).then(rows => rows.length > 0);
}

async function getLanguageCode(serverId) {
	let result = [];
	result = await client.query('SELECT * FROM language WHERE serverId = $1;', [serverId]).then(res => res.rows);
	if (result.length < 1)
		result = 'en_US';
	else
		result = result[0].languagecode;
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

async function getScore(serverId, userId) {
	return await client.query('SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY score) AS position, score, userId FROM score WHERE serverId = $1) AS allOfServer WHERE userId = $2 LIMIT 1;', [serverId, userId]).then(res => res.rows[0]);
}

async function setScore(serverId, userId, score) {
	const found = await client.query('SELECT * FROM score WHERE serverId = $1 AND userId = $2;', [serverId, userId]).then(res => res.rows).then(rows => rows.length > 0);
	if (found)
		return await client.query('UPDATE score SET score = $3 WHERE serverId = $1 AND userId = $2;', [serverId, userId, score]);
	else
		return await client.query('INSERT INTO score (serverId, userId, score) VALUES ($1, $2, $3);', [serverId, userId, score]);
}

async function addScore(serverId, userId, score) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	const current = await client.query('SELECT * FROM score WHERE serverId = $1 AND userId = $2 LIMIT 1;', [serverId, userId]).then(res => res.rows);
	if (current.length > 0) {
		if (score > 0)
			return await client.query('UPDATE score SET score = $3 WHERE serverId = $1 AND userId = $2;', [serverId, userId, current[0].score + score]);
		else
			throw lang.obj['mod_score_add_lower_than_1'];
	} else {
		if (score > 0)
			return await client.query('INSERT INTO score (serverId, userId, score) VALUES ($1, $2, $3);', [serverId, userId, score]);
		else
			throw lang.obj['mod_score_add_lower_than_1'];
	}
}

async function removeScore(serverId, userId, score) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	const current = await client.query('SELECT * FROM score WHERE serverId = $1 AND userId = $2 LIMIT 1;', [serverId, userId]).then(res => res.rows);
	if (current.length > 0) {
		if (score > 0 && current[0].score - score >= 0)
			return await client.query('UPDATE score SET score = $3 WHERE serverId = $1 AND userId = $2;', [serverId, userId, current[0].score - score]);
		else
			return unsetScore(serverId, userId);
	} else {
		return unsetScore(serverId, userId);
	}
}

async function unsetScore(serverId, userId) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	const found = await client.query('SELECT * FROM score WHERE serverId = $1 AND userId = $2 LIMIT 1;', [serverId, userId]).then(res => res.rows).then(rows => rows.length > 0);
	if (found)
		return await client.query('DELETE FROM score WHERE serverId = $1 AND userId = $2;', [serverId, userId]);
	else
		throw lang.obj['mod_score_unset_not_set'];
}

async function disconnect() {
	await client.end();
}

module.exports.connect = connect;
module.exports.prepareDb = prepareDb;
module.exports.addMod = addMod;
module.exports.removeMod = removeMod;
module.exports.listMods = listMods;
module.exports.isMod = isMod;
module.exports.resetMods = resetMods;
module.exports.addChannel = addChannel;
module.exports.removeChannel = removeChannel;
module.exports.listChannels = listChannels;
module.exports.isAllowedChannel = isAllowedChannel;
module.exports.resetChannels = resetChannels;
module.exports.setLanguage = setLanguage;
module.exports.unsetLanguage = unsetLanguage;
module.exports.getLanguageCode = getLanguageCode;
module.exports.getLanguages = getLanguages;
module.exports.getLanguageObject = getLanguageObject;
module.exports.getScore = getScore;
module.exports.setScore = setScore;
module.exports.addScore = addScore;
module.exports.removeScore = removeScore;
module.exports.unsetScore = unsetScore;
module.exports.disconnect = disconnect;
