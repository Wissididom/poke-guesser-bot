const { Constants } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");

function reveal(interaction) {
	// TODO: Reveals the current pokémon
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
		name: 'reveal',
		description: 'Reveals the current pokemon'
	};
}

// Exports each function separately
module.exports.reveal = reveal;
module.exports.getRegisterObject = getRegisterObject;
