const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");


async function delay(interaction, subcommand, db) {
	let title = '';
	let description = '';
	// returnEmbed(title, message, image=null)
	return {
		title: title,
		description: description
	};
}
function setDelay(user, days = 0, hours = 0, minutes = 0, seconds = 0) {
	// TODO: Execute Mod Actions
}

function unsetDelay(user) {
	// TODO: Execute Mod Actions
}

function showDelay(user) {
	// TODO: Execute Mod Actions
}

function getRegisterObject() {
	return {
		name: 'delay',
		description: 'Manage the delay of someone',
		type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
		options: [
			{
				name: 'set',
				description: 'Sets a users delay',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: 'user',
						description: 'The user whose delay you want to set',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.USER
					},
					{
						name: 'delay',
						description: 'The time you want to set the delay to',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.STRING
					}
				]
			},
			{
				name: 'unset',
				description: 'Unsets a users delay',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: 'user',
						description: 'The user whose delay you want to unset',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.USER
					}
				]
			},
			{
				name: 'show',
				description: 'Shows a users delay',
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
module.exports.delay = delay;
module.exports.setDelay = setDelay;
module.exports.unsetDelay = unsetDelay;
module.exports.showDelay = showDelay;
module.exports.getRegisterObject = getRegisterObject;
