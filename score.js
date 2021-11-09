const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");
const leaderboardJS = require('./leaderboard.js');

// Shows User Position and Score
function score(interaction) {
	// leaderboardJS.position(user);
	// leaderboardJS.score(user);
}

function getRegisterObject() {
	return {
		name: 'score',
		description: 'Shows the score of someone or yourself',
		options: [
			{
				name: 'show',
				description: 'Shows the Score of someone or yourself',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: 'user',
						description: 'The user whose score you want to know',
						required: true,
						type: Constants.ApplicationCommandOptionTypes.USER
					}
				]
			}
		]
	};
}

// Exports each function separately
module.exports.score = score;
module.exports.getRegisterObject = getRegisterObject;
