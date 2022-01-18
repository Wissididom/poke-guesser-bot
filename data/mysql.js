const mysql = require('mysql2/promise');
const { Permissions } = require('discord.js');

const config = {
	host: "localhost",
	user: "root",
	// password: "",
	database: "pokebot",
	rowsAsArray: true
}

async function prepareDb() {
	let result = [];
	let connection = await mysql.createConnection(config);
	await connection.query('CREATE DATABASE pokebot');
	await connection.query('CREATE TABLE channels');
	await connection.query('CREATE TABLE mods');
	await connection.end();
	return result;
}

async function isMod(serverId, mentionableId) {
	let connection = await mysql.createConnection(config);
	let [rows, fields] = await connection.execute('SELECT user FROM mods WHERE serverId = ? AND mentionableId = ?', [serverId, mentionableId]);
	await connection.end();
}
prepareDb().then(res => console.log).catch(err => console.error);

module.exports.isMod = isMod;
