const { Constants } = require('discord.js');
const language = require('./language.js');
const util = require("./util");
const delayJS = require('./delay.js');
const timeoutJS = require('./timeout.js');
const championshipJS = require('./championship.js');

async function mod(interaction, db) {
	await interaction.deferReply({ ephemeral: true }); // PokeBot is thinking
	const lang = await language.getLanguage(interaction.guildId, db);
	const subcommandgroup = interaction.options.getSubcommandGroup();
	const subcommand = interaction.options.getSubcommand();
	let isMod = false;
	if (await db.isMod(interaction.member)) {
		isMod = true;
	} else {
		interaction.member.roles.cache.each(async role => {
			if (!isMod && (await db.isMod(role)))
				isMod = true;
		});
	}
	let response = {
		title: '',
		description: ''
	};
	if (isMod) {
		switch (subcommandgroup) {
			case 'score': // /mod score ?
				switch (subcommand) {
					case 'add':
						try {
							let score = interaction.options.getInteger('score', false);
							if (score) {
								await db.addScore(interaction.guildId, interaction.options.getUser('user').id, score);
							} else {
								let user = interaction.options.getUser('user');
								let dbScore = await db.getScore(interaction.guildId, user.id);
								if (!dbScore)
									await db.setScore(interaction.guildId, user.id, 0);
							}
							response.title = lang.obj['mod_score_add_title_success'];
							response.description = lang.obj['mod_score_add_description_success'];
						} catch (err) {
							response.title = lang.obj['mod_score_add_title_failed'];
							response.description = `${lang.obj['mod_score_add_description_failed']}${err}`;
						}
						break;
					case 'remove':
						try {
							let score = interaction.options.getInteger('score', false);
							if (score) {
								await db.removeScore(interaction.guildId, interaction.options.getUser('user').id, score);
							} else {
								await db.unsetScore(interaction.guildId, interaction.options.getUser('user').id);
							}
							response.title = lang.obj['mod_score_remove_title_success'];
							response.description = lang.obj['mod_score_remove_description_success'];
						} catch (err) {
							response.title = lang.obj['mod_score_remove_title_failed'];
							response.description = `${lang.obj['mod_score_remove_description_failed']}${err}`;
						}
						break;
					case 'set':
						try {
							let score = interaction.options.getInteger('score', false);
							if (score) {
								await db.setScore(interaction.guildId, interaction.options.getUser('user').id, score);
							} else {
								let user = interaction.options.getUser('user');
								let dbScore = await db.getScore(interaction.guildId, user.id);
								if (!dbScore)
									await db.setScore(interaction.guildId, user.id, 0);
							}
							response.title = lang.obj['mod_score_set_title_success'];
							response.description = lang.obj['mod_score_set_description_success'];
						} catch (err) {
							response.title = lang.obj['mod_score_set_title_failed'];
							response.description = `${lang.obj['mod_score_set_description_failed']}${err}`;
						}
						break;
				}
				break;
			case 'delay': // /mod delay ?
				response = await delayJS.delay(interaction, subcommand, lang, db);
				break;
			case 'timeout': // /mod timeout ?
				response = await timeoutJS.timeout(interaction, subcommand, lang, db);
				break;
			case 'championship': // /mod championship ?
				response = await championshipJS.championship(interaction, subcommand, lang, db);
				break;
		}
	} else {
		response.title = lang.obj['mod_no_mod_title'];
		response.description = lang.obj['mod_no_mod_description'];
	}
	// returnEmbed(title, message, image=null)
	interaction.editReply({
		embeds: [util.returnEmbed(response.title, response.description)],
		ephemeral: true
	});
}

function getRegisterObject() {
	return {
		name: 'mod',
		description: 'Manage delay, timeout and score',
		options: [
			{
				name: 'score',
				description: 'Manage the score of someone',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
				options: [
					{
						name: 'add',
						description: 'Add a score to a user',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'user',
								description: 'The user whose score you want to update',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.USER
							},
							{
								name: 'score',
								description: 'The amount of points you want to add to the score',
								required: false,
								type: Constants.ApplicationCommandOptionTypes.INTEGER
							}
						]
					},
					{
						name: 'remove',
						description: 'Remove a score from a user',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'user',
								description: 'The user whose score you want to update',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.USER
							},
							{
								name: 'score',
								description: 'The amount of points you want to remove from the score',
								required: false,
								type: Constants.ApplicationCommandOptionTypes.INTEGER
							}
						]
					},
					{
						name: 'set',
						description: 'Set the score of a user',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'user',
								description: 'The user whose score you want to update',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.USER
							},
							{
								name: 'score',
								description: 'The amount of points you want to set the score',
								required: false,
								type: Constants.ApplicationCommandOptionTypes.INTEGER
							}
						]
					}
				]
			},
			delayJS.getRegisterObject(), timeoutJS.getRegisterObject(), championshipJS.getRegisterObject()
		]
	};
}

// Exports each function separately
module.exports.mod = mod;
module.exports.getRegisterObject = getRegisterObject;
// console.log(JSON.stringify(getRegisterObject(), null, 4));
