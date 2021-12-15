const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");

function championship(interaction) {
	// TODO: Renew the championship
}

function getRegisterObject() {
	return {
		name: 'championship',
		description: 'Manages the championship',
		type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
		options: [
			{
				name: 'new',
				description: 'Outputs the leaderboard one last time, reveals winner and clears the leaderboard',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
			}
		]
	};
}

// Exports each function separately
module.exports.championship = championship;
module.exports.getRegisterObject = getRegisterObject;
