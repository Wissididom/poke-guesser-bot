// const { Client } = require('pg');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const language = require('./../language.js');
const util = require('./../util.js');
// Discord-IDs are 18 chars atm (2021) but will increase in the future

var db = null;

if (process.env['DATABASE_URL']) {
	db = new Sequelize(process.env['DATABASE_URL']);
} else {
	db = new Sequelize(process.env['POSTGRES_DB'], process.env['POSTGRES_USER'], process.env['POSTGRES_PASSWORD'], {
		host: process.env['POSTGRES_HOST'],
		port: parseInt(process.env['POSTGRES_PORT']),
		dialect: 'postgres' // one of 'mysql' | 'mariadb' | 'postgres' | 'mssql'
	});
}

// Mods
const Mod = db.define('mod', {
	/*id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},*/
	serverId: {
		type: DataTypes.STRING,
		allowNull: false
	},
	mentionableId: {
		type: DataTypes.STRING,
		allowNull: false
	},
	isUser: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
}, {
	timestamps: false
});
// Channels
const Channel = db.define('channel', {
	serverId: {
		type: DataTypes.STRING,
		allowNull: false
	},
	channelId: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	timestamps: false
});
// Language
const Language = db.define('language', {
	serverId: {
		type: DataTypes.STRING,
		allowNull: false
	},
	languageCode: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	timestamps: false
});
// Score
const Score = db.define('score', {
	serverId: {
		type: DataTypes.STRING,
		allowNull: false
	},
	userId: {
		type: DataTypes.STRING,
		allowNull: false
	},
	score: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	timestamps: false
});
// Encounter
const Encounter = db.define('encounter', {
	serverId: {
		type: DataTypes.STRING,
		allowMull: false
	},
	channelId: { // If we ever want to make it possible to have multiple guessing games in one server. I set allowNull to true because I think we can make it like `if (channelId == null)` to make independant of channels.
		type: DataTypes.STRING,
		allowNull: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	language: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	timestamps: false
});
// Artwork
const Artwork = db.define('artwork', {
	serverId: {
		type: DataTypes.STRING,
		allowMull: false
	},
	channelId: { // If we ever want to make it possible to have multiple guessing games in one server. I set allowNull to true because I think we can make it like `if (channelId == null)` to make independant of channels.
		type: DataTypes.STRING,
		allowNull: true
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	timestamps: false
});
// LastExplore
const LastExplore = db.define('lastexplore', {
	serverId: {
		type: DataTypes.STRING,
		allowMull: false
	},
	channelId: { // If we ever want to make it possible to have multiple guessing games in one server. I set allowNull to true because I think we can make it like `if (channelId == null)` to make independant of channels.
		type: DataTypes.STRING,
		allowNull: true
	},
	time: {
		type: DataTypes.BIGINT,
		allowNull: false
	}
}, {
	timestamps: false
});

async function connect() {
	return await db.authenticate();
}

async function prepareDb() {
	return await db.sync();
}

async function addMod(mentionable) {
	const lang = await language.getLanguage(mentionable.guild.id, {
		getLanguageCode
	});
	let result = [];
	if (await isMod(mentionable))
		throw util.isUser(mentionable) ? lang.obj['settings_mods_add_already_existing_user'].replace('{mentionable}', `<@!${mentionable.userId || mentionable.id}>`) : lang.obj['settings_mods_add_already_existing_role'].replace('{mentionable}', `<@&${mentionable.userId || mentionable.id}>`);
	else
		result.push(await Mod.create({
			serverId: mentionable.guild.id,
			mentionableId: mentionable.userId || mentionable.id,
			isUser: util.isUser(mentionable)
		}));
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
		result.push(await Mod.destroy({
			where: {
				serverId: mentionable.guild.id,
				mentionableId: mentionable.userId || mentionable.id
			}
		}));
	return result;
}

async function listMods(serverId) {
	return await Mod.findAll({
		where: {
			serverId
		}
	});
}

async function isMod(mentionable) {
	return (await Mod.count({
		where: {
			serverId: mentionable.guild.id,
			mentionableId: mentionable.userId || mentionable.id
		}
	})) > 0;
}

async function resetMods(serverId) {
	let result = [];
	result.push(await Mod.destroy({
		where: {
			serverId
		}
	}));
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
		result.push(Channel.create({
			serverId: channel.guildId,
			channelId: channel.id
		}));
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
		result.push(await Channel.destroy({
			where: {
				serverId: channel.guildId,
				channelId: channel.id
			}
		}))
	return result;
}

async function listChannels(serverId) {
	return await Channel.findAll({
		where: {
			serverId
		}
	})
}

async function isAllowedChannel(channel) {
	return (await Channel.count({
		where: {
			serverId: channel.guildId,
			channelId: channel.id
		}
	})) > 0;
}

async function isAnyAllowedChannel(serverId) {
	return (await Channel.count({
		where: {
			serverId
		}
	})) > 0;
}

async function resetChannels(serverId) {
	let result = [];
	result.push(await Channel.destroy({
		where: {
			serverId
		}
	}))
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
		result.push(await Language.update({ languageCode }, {
			where: {
				serverId
			}
		}));
	else
		result.push(Language.create({
			serverId,
			languageCode
		}));
	return result;
}

async function unsetLanguage(serverId) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	let result = [];
	if (await isAnyLanguageSet(serverId))
		result.push(await Language.destroy({
			where: {
				serverId
			}
		}));
	else
		throw lang.obj['settings_language_unset_not_set'];
	return result;
}

async function isLanguageSet(serverId, languageCode) {
	return (await Language.findAll({
		where: {
			serverId,
			languageCode
		}
	})).length > 0;
}

async function isAnyLanguageSet(serverId) {
	return (await Language.findAll({
		where: {
			serverId
		}
	})).length > 0;
}

async function getLanguageCode(serverId) {
	let result = [];
	result = await Language.findAll({
		where: {
			serverId
		}
	});
	if (result.length < 1)
		result = 'en_US';
	else
		result = result[0].getDataValue('languageCode');
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
	let scores = await Score.findAll({
		where: {
			serverId
		},
		order: [
			[ 'score', 'DESC' ]
		]
	});
	let position = 1;
	for (let i = 0; i < scores.length; i++) {
		if (scores[i].getDataValue('userId') == userId)
			return {
				position,
				serverId,
				userId,
				score: scores[i].getDataValue('score')
			}
		position++;
	}
}

async function getScores(serverId) {
	return await Score.findAll({
		where: {
			serverId,
			userId
		},
		order: [
			[ 'score', 'DESC' ]
		]
	});
}

async function setScore(serverId, userId, score) {
	const found = await Score.count({
		where: {
			serverId,
			userId
		}
	});
	if (found > 0)
		return await Score.update({
			score
		}, {
			where: {
				serverId,
				userId
			}
		});
	else
		return await Score.create({
			serverId,
			userId,
			score
		});
}

async function addScore(serverId, userId, score) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	const current = await Score.findOne({
		where: {
			serverId,
			userId
		}
	});
	if (current) {
		if (score > 0)
			return await Score.update({
				score: current.getDataValue('score') + score
			}, {
				where: {
					serverId,
					userId
				}
			});
		else
			throw lang.obj['mod_score_add_lower_than_1'];
	} else {
		if (score > 0)
			return Score.create({
				serverId,
				userId,
				score
			});
		else
			throw lang.obj['mod_score_add_lower_than_1'];
	}
}

async function removeScore(serverId, userId, score) {
	const lang = await language.getLanguage(serverId, {
		getLanguageCode
	});
	const current = await Score.findOne({
		where: {
			serverId,
			userId
		}
	});
	if (current) {
		if (score > 0 && current.getDataValue('score') - score >= 0)
			return await Score.update({
				score: current.getDataValue('score') - score
			}, {
				where: {
					serverId,
					userId
				}
			});
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
	const found = await Score.count({
		where: {
			serverId,
			userId
		}
	});
	if (found > 0)
		return Score.destroy({
			where: {
				serverId,
				userId
			}
		});
	else
		throw lang.obj['mod_score_unset_not_set'];
}

async function clearEncounters(serverId, channelId) {
	Encounter.destroy({
		where: {
			serverId,
			channelId
		}
	});
}

async function addEncounter(serverId, channelId, name, language) {
	return Encounter.create({
		serverId,
		channelId,
		name,
		language
	});
}

async function getEncounter(serverId, channelId) {
	return await Encounter.findAll({
		where: {
			serverId,
			channelId
		}
	});
}

async function artworkExists(serverId, channelId) {
	return (await Artwork.count({
		where: {
			serverId,
			channelId
		}
	})) > 0;
}

async function getArtwork(serverId, channelId) {
	return (await Artwork.findOne({
		where: {
			serverId,
			channelId
		}
	})).url;
}

async function setArtwork(serverId, channelId, url) {
	if (await artworkExists(serverId, channelId)) {
		return await Artwork.update({
			url
		}, {
			where: {
				serverId,
				channelId
			}
		});
	} else {
		return await Artwork.create({
			serverId,
			channelId,
			url
		});
	}
}

async function unsetArtwork(serverId, channelId) {
	if (await artworkExists(serverId, channelId)) {
		return await Artwork.destroy({
			where: {
				serverId,
				channelId
			}
		});
	}
}

async function lastExploreExists(serverId, channelId) {
	return (await Artwork.count({
		where: {
			serverId,
			channelId
		}
	})) > 0;
}

async function getLastExplore(serverId, channelId) {
	return (await lastExplore.findOne({
		where: {
			serverId,
			channelId
		}
	})).time;
}

async function setLastExplore(serverId, channelId, time) {
	if (await artworkExists(serverId, channelId)) {
		return await LastExplore.update({
			time
		}, {
			where: {
				serverId,
				channelId
			}
		});
	} else {
		return await LastExplore.create({
			serverId,
			channelId,
			time
		});
	}
}

async function unsetLastExplore(serverId, channelId) {
	if (await lastExploreExists(serverId, channelId)) {
		return await LastExplore.destroy({
			where: {
				serverId,
				channelId
			}
		});
	}
}

async function disconnect() {
	await db.close();
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
module.exports.isAnyAllowedChannel = isAnyAllowedChannel;
module.exports.resetChannels = resetChannels;
module.exports.setLanguage = setLanguage;
module.exports.unsetLanguage = unsetLanguage;
module.exports.getLanguageCode = getLanguageCode;
module.exports.getLanguages = getLanguages;
module.exports.getLanguageObject = getLanguageObject;
module.exports.getScore = getScore;
module.exports.getScores = getScores;
module.exports.setScore = setScore;
module.exports.addScore = addScore;
module.exports.removeScore = removeScore;
module.exports.unsetScore = unsetScore;
module.exports.clearEncounters = clearEncounters;
module.exports.addEncounter = addEncounter;
module.exports.getEncounter = getEncounter;
module.exports.getArtwork = getArtwork;
module.exports.setArtwork = setArtwork;
module.exports.unsetArtwork = unsetArtwork;
module.exports.getLastExplore = getLastExplore;
module.exports.setLastExplore = setLastExplore;
module.exports.unsetLastExplore = unsetLastExplore;
module.exports.disconnect = disconnect;
