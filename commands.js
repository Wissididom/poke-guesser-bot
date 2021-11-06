const { Constants } = require('discord.js');

function getRegisterObjects() {
	return {
		'help': {
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
		},
		'configure': {
			type: Constants.ApplicationCommandTypes.CHAT_INPUT,
			name: 'configure',
			description: 'Shows how to configure the bot in an ephemeral message'
		},
		'settings': {
			type: Constants.ApplicationCommandTypes.CHAT_INPUT,
			name: 'settings',
			description: 'View or set settings in an ephemeral message',
			options: [
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
				}
			]
		},
		'catch': {
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
		},
		'leaderboard': {
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
		},
		'score': {
			name: 'score',
			description: 'Shows the Score of someone or yourself',
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
		},
		'mod': {
			name: 'mod',
			description: 'Manage delay, timeout and score',
			options: [
				{
					name: 'score',
					description: 'Manage the score of someone',
					type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
					options: [
						{
							name: 'add',
							description: 'Add a score to a user',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose score you want to update',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								},
								{
									name: 'score',
									description: 'The amount of points you want to add to the score',
									required: false,
									type: Constants.ApplicationCommandOptionTypes.INTEGER
								}
							]
						},
						{
							name: 'remove',
							description: 'Remove a score from a user',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose score you want to update',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								},
								{
									name: 'score',
									description: 'The amount of points you want to remove from the score',
									required: false,
									type: Constants.ApplicationCommandOptionTypes.INTEGER
								}
							]
						},
						{
							name: 'set',
							description: 'Set a score of a user',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose score you want to update',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								},
								{
									name: 'score',
									description: 'The amount of points you want to set the score',
									required: false,
									type: Constants.ApplicationCommandOptionTypes.INTEGER
								}
							]
						}
					]
				},
				{
					name: 'delay',
					description: 'Manage the delay of someone',
					type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
					options: [
						{
							name: 'set',
							description: 'Sets a users delay',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose delay you want to set',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								},
								{
									name: 'delay',
									description: 'The time you want to set the delay to',
									required: false,
									type: Constants.ApplicationCommandOptionTypes.STRING
								}
							]
						},
						{
							name: 'unset',
							description: 'Unsets a users delay',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose delay you want to unset',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								}
							]
						},
						{
							name: 'show',
							description: 'Shows a users delay',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose score you want to show',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								}
							]
						}
					]
				},
				{
					name: 'timeout',
					description: 'Manage the timeout of someone',
					type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
					options: [
						{
							name: 'set',
							description: 'Sets a users timeout',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose timeout you want to set',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								},
								{
									name: 'timeout',
									description: 'The time you want to set the timeout to',
									required: false,
									type: Constants.ApplicationCommandOptionTypes.STRING
								}
							]
						},
						{
							name: 'unset',
							description: 'Unsets a users timeout',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose timeout you want to unset',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								}
							]
						},
						{
							name: 'show',
							description: 'Shows a users timeout',
							type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
							options: [
								{
									name: 'user',
									description: 'The user whose score you want to show',
									required: true,
									type: Constants.ApplicationCommandOptionTypes.USER
								}
							]
						}
					]
				}
			]
		}
	};
}

module.exports.getRegisterObjects = getRegisterObjects
module.exports.help = require('./help.js').help;
