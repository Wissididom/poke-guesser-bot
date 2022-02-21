const { Constants } = require('discord.js');
const util = require("./util");

// Sanitizes leaderboard by removing non-existent users which might break other functions
function sanitizeLeaderboard(client, leaderboard) {
	// Returns a promise
	return new Promise(function(resolve, reject) {
		let promises = [];
		// Iterate through leaderboard object
		for (const [userId, score] of Object.entries(leaderboard)) {
			// Retrieve user from guild, or null if doesn't exist
			objLength = Object.keys(leaderboard).length;
			promises.push(findUser(client, userId).then(user => {
				// If user object is null, delete the key from leaderboard
				if (!user) {
					console.log(`Removing User ID ${userId} from leaderboard.`);
					delete leaderboard[userId];
				}
			}));
		}
		Promise.all(promises).then(values => {
			// Resolves promise and returns leaderboard once fake users removed
			resolve(leaderboard);
		});
	});
}

// DEBUGGING - Adds dummy users to leaderboard - for testing leaderboard embed with different numbers of users
function generateLeaderboard(leaderboard) {
	for (i=0; i<20; i++) {
		let userName = `user${i+1}`;
		let score = Math.floor(Math.random() * 10);
		leaderboard[userName] = score;
	}
	return leaderboard;
}

function leaderboard(interaction) {
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
		name: 'leaderboard',
		description: 'Shows the Leaderboard'
	};
}

// Exports each function separately
module.exports.leaderboard = leaderboard;
module.exports.getRegisterObject = getRegisterObject;
