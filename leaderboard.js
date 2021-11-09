const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");

// Sets score of user
function setScore(user, score = null) {
	// Get userId from msg
	console.log(`leaderboard.addScore received userId: ${user.id}`)
	console.log(`Adding score to user: ${user.username}`);
	// TODO: Update leaderboard
}

// Add score to user
function addScore(user, score = null) {
	// Get userId from msg
	console.log(`leaderboard.addScore received userId: ${user.id}`)
	console.log(`Adding score to user: ${user.username}`);
	// TODO: Update leaderboard
}

// Remove score from user
function removeScore(user, score = null) {
	// Get userId from msg
	console.log(`leaderboard.removeScore received userId: ${user.id}`)
	console.log(`Removing score from user: ${user.username}`);
	// TODO: Update leaderboard
}

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

// Shows Leaderboard by creating a new Embed
function showLeaderboard(msg, debug=false) {
	// TODO: Show Leaderboard
}

// Shows User Position
function position(user) {
	// TODO: Show Position and Score of User
}

// Shows User Score
function score(user) {
	// TODO: Show Position and Score of User
}

// Formally resets leaderboard and announces the end of the championship
function newChampionship(msg) {
	// TODO: Output message that the championship has ended and x is the victor
}

// Empties leaderboard
function emptyLeaderboard(msg) {
	// TODO: Empty/Clear leaderboard
}

function leaderboard(interaction) {
	// TODO: Handle leaderboard interaction
}

function getRegisterObject() {
	return {
		name: 'leaderboard',
		description: 'Shows the Leaderboard',
		options: [
			{
				name: 'ephemeral',
				description: 'Show the Leaderboard as an ephemeral message (only you can see it)',
				required: false,
				type: Constants.ApplicationCommandOptionTypes.BOOLEAN
			}
		]
	};
}

// Exports each function separately
module.exports.setScore = setScore;
module.exports.addScore = addScore;
module.exports.removeScore = removeScore;
module.exports.showLeaderboard = showLeaderboard;
module.exports.position = position;
module.exports.score = score;
module.exports.newChampionship = newChampionship;
module.exports.emptyLeaderboard = emptyLeaderboard;
module.exports.leaderboard = leaderboard;
module.exports.getRegisterObject = getRegisterObject;
