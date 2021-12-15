const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");
const leaderboardJS = require('./leaderboard.js');
const delayJS = require('./delay.js');
const timeoutJS = require('./timeout.js');
const championshipJS = require('./championship.js');

function mod(interaction) {
	// TODO: Execute Mod Actions
	//const type = interaction.options.getString('type');
	let title = '';
	let description = '';
	// returnEmbed(title, message, image=null)
	interaction.reply({
		embeds: [util.returnEmbed(title, description)],
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
