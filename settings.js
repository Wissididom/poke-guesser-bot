const { Constants } = require('discord.js');
const util = require('./util.js');

function settings(interaction) {
	// const type = interaction.options.getString('type');
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
		type: Constants.ApplicationCommandTypes.CHAT_INPUT,
		name: 'settings',
		description: 'View or set settings in an ephemeral message',
		options: [
			{
				name: 'admins',
				description: 'View, add or remove bot admins',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
				options: [
					{
						name: 'add',
						description: 'Add a bot admin',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'mentionable',
								description: 'The user or role to add as a bot mod',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.MENTIONABLE
							}
						]
					},
					{
						name: 'remove',
						description: 'Remove a bot admin',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'mentionable',
								description: 'The user or role to remove from the bot mods',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.MENTIONABLE
							}
						]
					},
					{
						name: 'show',
						description: 'Shows the current admins',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
					},
					{
						name: 'help',
						description: 'Shows help for admin settings',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
					}
				]
			},
			{
				name: 'mods',
				description: 'View, add or remove bot mods',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
				options: [
					{
						name: 'add',
						description: 'Add a bot mod',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'mentionable',
								description: 'The user or role to add as a bot mod',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.MENTIONABLE
							}
						]
					},
					{
						name: 'remove',
						description: 'Remove a bot mod',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'mentionable',
								description: 'The user or role to remove from the bot mods',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.MENTIONABLE
							}
						]
					},
					{
						name: 'show',
						description: 'Shows the current mods',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
					},
					{
						name: 'help',
						description: 'Shows help for mod settings',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
					}
				]
			},
			{
				name: 'channels',
				description: 'View, add or remove channels in which the bot responds',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
				options: [
					{
						name: 'add',
						description: 'Add a channel in which the bot responds',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'channel',
								description: 'The channel in which the bot should start responding',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.CHANNEL
							}
						]
					},
					{
						name: 'remove',
						description: 'Remove a channel from the channels in which the bot responds',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
						options: [
							{
								name: 'channel',
								description: 'The channel in which the bot should stop responding',
								required: true,
								type: Constants.ApplicationCommandOptionTypes.CHANNEL
							}
						]
					},
					{
						name: 'show',
						description: 'Shows the current channels in which the bot responds',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
					},
					{
						name: 'help',
						description: 'Shows help for mod settings',
						type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
					}
				]
			},
			{
				name: 'show',
				description: 'Shows the current settings',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
			},
			{
				name: 'reset',
				description: 'Resets the current settings',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
			},
			{
				name: 'help',
				description: 'Shows Help for the /settings command',
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
			}
		]
	};
}

module.exports.settings = settings;
module.exports.getRegisterObject = getRegisterObject;
