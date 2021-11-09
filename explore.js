const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");

// Shows User Position and Score
function explore(interaction) {
	// TODO: Generate and respond with pokémon
}

function getRegisterObject() {
	return {
		name: 'explore',
		description: 'Generates a new pokemon'
	};
}

// Exports each function separately
module.exports.explore = explore;
module.exports.getRegisterObject = getRegisterObject;
