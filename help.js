const { Constants } = require('discord.js');
const util = require('./util.js');

function help(interaction) {
	const type = interaction.options.getString('type');
	let title = '';
	let description = '';
	switch (type) {
		case 'admin':
			title = 'Admin Help';
			description = `
			  \`/settings admins add <role or user>\` - Adds a role or user to the collection of bot admins for this server
			  \`/settings admins remove <role or user>\` - Removes a role or user from the collection of bot admins for this server
			  \`/settings admins show\` - Shows the current bot admins for this server
			  \`/settings admins help\` - Shows Help for the subcommands below /settings admins
			  \`/settings mods add <role or user>\` - Adds a role or user to the collection of bot mods for this server
			  \`/settings mods remove <role or user>\` - Removes a role or user from the collection of bot mods for this server
			  \`/settings mods show\` - Shows the current bot mods for this server
			  \`/settings mods help\` - Shows Help for the subcommands below /settings mods
			  \`/settings channels add <channel>\` - Adds a channel to the collection of channels of this server in which the bot responds
			  \`/settings channels remove <channel>\` - Removes a channel from the collection of channels of this server in which the bot responds
			  \`/settings channels show\` - Shows the currently set channels of this server in which the bot responds
			  \`/settings channels help\` - Shows Help for the subcommands below /settings channels
			  \`/settings show\` - Shows the current settings of this server (admins, mods and channels in which the bot responds)
			  \`/settings reset\` - Resets the current settings of this server (admins, mods and channels in which the bot responds)
			  \`/settings help\` - Shows Help for the subcommands below /settings`;
			break;
		case 'mod':
			title = 'Mod Help';
			description = `
			  \`/explore\` - Generates a new pokemon
			  \`/reveal\` - Reveals the current pokemon
			  \`/mod score add <user> [<score>]\` - Adds a score to a user
			  \`/mod score remove <user> [<score>]\` - Removes a score from a user
			  \`/mod score set <user> [<score>]\` - Sets the score of a user
			  \`/mod delay set <user> <delay>\` - Sets a users delay
			  \`/mod delay unset <user>\` - Unsets a users delay
			  \`/mod delay show <user>\` - Shows a users delay
			  \`/mod timeout set <user> <timeout>\` - Sets a users timeout
			  \`/mod timeout unset <user>\` - Unsets a users timeout
			  \`/mod timeout show <user>\` - Shows a users timeout
			  \`/mod championship new\` - Outputs the leaderboard one last time, reveals winner and clears the leaderboard`;
			break;
		case 'player':
			title = 'Player Help';
			description = `
			  \`/catch <pokemon>\` - Catch a previously generated pokemon
			  \`/leaderboard\` - Shows the Leaderboard
			  \`/score show [<user>]\` - Shows the score (and position) of someone or yourself`;
			break;
	}
	// returnEmbed(title, message, image=null)
	interaction.reply({
		embeds: [util.returnEmbed(title, description)],
		ephemeral: true
	});
}

function getRegisterObject() {
	return {
		type: Constants.ApplicationCommandTypes.CHAT_INPUT,
		name: 'help',
		description: 'Shows help in an ephemeral message',
		options: [
			{
				name: 'type',
				description: 'Choose which help to show',
				required: true,
				type: Constants.ApplicationCommandOptionTypes.STRING,
				choices: [
					{
						name: 'admin',
						value: 'admin'
					},
					{
						name: 'mod',
						value: 'mod'
					},
					{
						name: 'player',
						value: 'player'
					}
				]
			}
		]
	};
}

module.exports.help = help;
module.exports.getRegisterObject = getRegisterObject;
