const { Constants } = require('discord.js');
const util = require("./util");

async function timeout(interaction, subcommand, lang, db) {
	let response = {
		title: '',
		description: ''
	};
	switch (subcommand) {
		case 'set':
			try {
				let d = interaction.options.getInteger('days', false) || 0;
				let h = interaction.options.getInteger('hours', false) || 0;
				let m = interaction.options.getInteger('minutes', false) || 0;
				let s = interaction.options.getInteger('seconds', false) || 0;
				await setTimeout(interaction.guildId, interaction.options.getUser('user').id, d, h, m, s);
				response.title = lang.obj['mod_timeout_set_title_success'];
				response.description = lang.obj['mod_timeout_set_description_success'];
			} catch (err) {
				response.title = lang.obj['mod_timeout_set_title_failed'];
				response.description = `${lang.obj['mod_timeout_set_description_failed']}${err}`;
			}
			break;
		case 'unset':
			try {
				await unsetTimeout(interaction.guildId, interaction.options.getUser('user').id);
				response.title = lang.obj['mod_timeout_unset_title_success'];
				response.description = lang.obj['mod_timeout_unset_description_success'];
			} catch (err) {
				response.title = lang.obj['mod_timeout_unset_title_failed'];
				response.description = `${lang.obj['mod_timeout_unset_description_failed']}${err}`;
			}
			break;
		case 'show':
			try {
				await showTimeout(interaction.guildId, interaction.options.getUser('user').id);
				response.title = lang.obj['mod_timeout_show_title_success'];
				response.description = lang.obj['mod_timeout_show_description_success'];
			} catch (err) {
				response.title = lang.obj['mod_timeout_show_title_failed'];
				response.description = `${lang.obj['mod_timeout_show_description_failed']}${err}`;
			}
			break;
	}
	// returnEmbed(title, message, image=null)
	return response;
}

function setTimeout(serverId, userId, days = 0, hours = 0, minutes = 0, seconds = 0) {
	// TODO: Execute Mod Actions
}

function unsetTimeout(serverId, userId) {
	// TODO: Execute Mod Actions
}

function showTimeout(serverId, userId) {
	// TODO: Execute Mod Actions
}

function getRegisterObject() {
	return {
		name: 'timeout',
		description: 'Manage the timeout of someone',
		type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
		options: [
			{
				name: 'set',
				description: 'Sets a users timeout',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: 'user',
						description: 'The user whose timeout you want to set',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.USER
					},
					{
						name: 'days',
						description: 'The time you want to set the timeout to',
						required: false,
						type: Constants.ApplicationCommandOptionTypes.INTEGER
					},
					{
						name: 'hours',
						description: 'The time you want to set the timeout to',
						required: false,
						type: Constants.ApplicationCommandOptionTypes.INTEGER
					},
					{
						name: 'minutes',
						description: 'The time you want to set the timeout to',
						required: false,
						type: Constants.ApplicationCommandOptionTypes.INTEGER
					},
					{
						name: 'seconds',
						description: 'The time you want to set the timeout to',
						required: false,
						type: Constants.ApplicationCommandOptionTypes.INTEGER
					}
				]
			},
			{
				name: 'unset',
				description: 'Unsets a users timeout',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: 'user',
						description: 'The user whose timeout you want to unset',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.USER
					}
				]
			},
			{
				name: 'show',
				description: 'Shows a users timeout',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: 'user',
						description: 'The user whose score you want to show',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.USER
					}
				]
			}
		]
	};
}

// Exports each function separately
module.exports.timeout = timeout;
module.exports.getRegisterObject = getRegisterObject;
