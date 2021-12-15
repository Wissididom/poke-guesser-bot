const { Constants } = require('discord.js');
const util = require('./util.js');

function _catch(interaction) {
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
		name: 'catch',
		description: 'Catch a previously generated pokémon',
		options: [
			{
				name: 'pokemon',
				description: 'The name of the pokemon you want to guess',
				required: true,
				type: Constants.ApplicationCommandOptionTypes.STRING
			}
		]
	};
}

module.exports._catch = _catch;
module.exports.getRegisterObject = getRegisterObject;
