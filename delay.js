const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const util = require("./util");


async function delay(interaction, subcommand, lang, db) {
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
				await setDelay(interaction.guildId, interaction.options.getUser('user'), d, h, m, s);
				response.title = lang.obj['mod_delay_set_title_success'];
				response.description = lang.obj['mod_delay_set_description_success'];
			} catch (err) {
				response.title = lang.obj['mod_delay_set_title_failed'];
				response.description = `${lang.obj['mod_delay_set_description_failed']}${err}`;
			}
			break;
		case 'unset':
			try {
				await unsetDelay(interaction.guildId, interaction.options.getUser('user'));
				response.title = lang.obj['mod_delay_unset_title_success'];
				response.description = lang.obj['mod_delay_unset_description_success'];
			} catch (err) {
				response.title = lang.obj['mod_delay_unset_title_failed'];
				response.description = `${lang.obj['mod_delay_unset_description_failed']}${err}`;
			}
			break;
		case 'show':
			try {
				await showDelay(interaction.guildId, interaction.options.getUser('user'));
				response.title = lang.obj['mod_delay_show_title_success'];
				response.description = lang.obj['mod_delay_show_description_success'];
			} catch (err) {
				response.title = lang.obj['mod_delay_show_title_failed'];
				response.description = `${lang.obj['mod_delay_show_description_failed']}${err}`;
			}
			break;
	}
	// returnEmbed(title, message, image=null)
	return response;
}
async function setDelay(serverId, userId, days = 0, hours = 0, minutes = 0, seconds = 0) {
	// TODO: Execute Mod Actions
}

async function unsetDelay(serverId, userId) {
	// TODO: Execute Mod Actions
}

async function showDelay(serverId, userId) {
	// TODO: Execute Mod Actions
}

function getRegisterObject() {
	return {
		name: 'delay',
		description: 'Manage the delay of someone',
		type: ApplicationCommandOptionType.SubcommandGroup,
		options: [
			{
				name: 'set',
				description: 'Sets a users delay',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						description: 'The user whose delay you want to set',
						required: true,
						type: ApplicationCommandOptionType.User
					},
					{
						name: 'days',
						description: 'The time you want to set the delay to',
						required: false,
						type: ApplicationCommandOptionType.Integer
					},
					{
						name: 'hours',
						description: 'The time you want to set the delay to',
						required: false,
						type: ApplicationCommandOptionType.Integer
					},
					{
						name: 'minutes',
						description: 'The time you want to set the delay to',
						required: false,
						type: ApplicationCommandOptionType.Integer
					},
					{
						name: 'seconds',
						description: 'The time you want to set the delay to',
						required: false,
						type: ApplicationCommandOptionType.Integer
					}
				]
			},
			{
				name: 'unset',
				description: 'Unsets a users delay',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						description: 'The user whose delay you want to unset',
						required: true,
						type: ApplicationCommandOptionType.User
					}
				]
			},
			{
				name: 'show',
				description: 'Shows a users delay',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						description: 'The user whose score you want to show',
						required: true,
						type: ApplicationCommandOptionType.User
					}
				]
			}
		]
	};
}

// Exports each function separately
module.exports.delay = delay;
module.exports.getRegisterObject = getRegisterObject;
