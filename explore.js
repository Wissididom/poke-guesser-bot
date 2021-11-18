const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");

// Shows User Position and Score
function explore(interaction) {
	// TODO: Generate and respond with pokémon
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
		name: 'explore',
		description: 'Generates a new pokemon'
	};
}

// Exports each function separately
module.exports.explore = explore;
module.exports.getRegisterObject = getRegisterObject;
