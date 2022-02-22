const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");

async function timeout(interaction, subcommand, db) {
	let title = '';
	let description = '';
	// returnEmbed(title, message, image=null)
	return {
		title: title,
		description: description
	};
}

function setTimeout(user, days = 0, hours = 0, minutes = 0, seconds = 0) {
	// TODO: Execute Mod Actions
}

function unsetTimeout(user) {
	// TODO: Execute Mod Actions
}

function showTimeout(user) {
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
						name: 'timeout',
						description: 'The time you want to set the timeout to',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.STRING
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
module.exports.setTimeout = setTimeout;
module.exports.unsetTimeout = unsetTimeout;
module.exports.showTimeout = showTimeout;
module.exports.getRegisterObject = getRegisterObject;
