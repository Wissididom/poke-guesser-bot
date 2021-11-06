const util = require('./util.js');

function help(interaction) {
	const type = interaction.options.getString('type');
	switch (type) {
		case 'admin':
			break;
		case 'mod':
			break;
		case 'player':
			break;
	}
	// returnEmbed(title, message, image=null)
	interaction.reply({
		content: 'Help',
		embeds: [util.returnEmbed('Help', 'Here comes the help....')],
		ephemeral: true
	});
}

module.exports.help = help;
