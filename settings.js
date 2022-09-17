const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const language = require('./language.js');
const util = require('./util.js');

async function settings(interaction, db) {
	await interaction.deferReply({ ephemeral: true }); // PokeBot is thinking
	const lang = await language.getLanguage(interaction.guildId, db);
	if (!interaction.guild.available)
		return;
	// https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
	console.log(`Owner:${interaction.guild.ownerId == interaction.user.id}; Administrator:${interaction.memberPermissions.has('Administrator', false)}`);
	if (interaction.guild.ownerId != interaction.user.id/*Owner*/ && !interaction.memberPermissions?.has('Administrator', false)/*Administrator-Permission*/) {
		interaction.editReply({
			embeds: [util.returnEmbed(lang.obj['settings_command_forbidden_error_title'], lang.obj['settings_command_forbidden_error_description'])],
			ephemeral: true
		});
		return;
	}
	let title = '';
	let description = '';
	let subcommandgroup = null;
	const subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case 'add':
			subcommandgroup = interaction.options.getSubcommandGroup(false);
			switch (subcommandgroup) {
				case 'mods': // /settings mods add
					try {
						await db.addMod(interaction.options.getMentionable('mentionable'));
						title = lang.obj['settings_mods_add_title_success'];
						description = lang.obj['settings_mods_add_description_success'];
					} catch (err) {
						title = lang.obj['settings_mods_add_title_failed'];
						description = `${lang.obj['settings_mods_add_description_failed']}${err}`;
					}
					break;
				case 'channels': // /settings channels add
					try {
						await db.addChannel(interaction.options.getChannel('channel'));
						title = lang.obj['settings_channels_add_title_success'];
						description = lang.obj['settings_channels_add_description_success'];
					} catch (err) {
						title = lang.obj['settings_channels_add_title_failed'];
						description = `${lang.obj['settings_channels_add_description_failed']}${err}`;
					}
					break;
				default:
					break;
			}
			break;
		case 'remove':
			subcommandgroup = interaction.options.getSubcommandGroup(false);
			switch (subcommandgroup) {
				case 'mods': // /settings mods remove
					try {
						await db.removeMod(interaction.options.getMentionable('mentionable'));
						title = lang.obj['settings_mods_remove_title_success'];
						description = lang.obj['settings_mods_remove_description_success'];
					} catch (err) {
						title = lang.obj['settings_mods_remove_title_failed'];
						description = `${lang.obj['settings_mods_remove_description_failed']}${err}`;
					}
					break;
				case 'channels': // /settings channels remove
					try {
						await db.removeChannel(interaction.options.getChannel('channel'));
						title = lang.obj['settings_channels_remove_title_success'];
						description = lang.obj['settings_channels_remove_description_success'];
					} catch (err) {
						title = lang.obj['settings_channels_remove_title_failed'];
						description = `${lang.obj['settings_channels_remove_description_failed']}${err}`;
					}
					break;
				default:
					break;
			}
			break;
		case 'show':
			subcommandgroup = interaction.options.getSubcommandGroup(false);
			switch (subcommandgroup) {
				case 'mods': // /settings mods show
					title = lang.obj['settings_mods_show_title'];
					const mods = await db.listMods(interaction.guildId);
					for (let i = 0; i < mods.length; i++) {
						description += `<@${mods[i].getDataValue('isUser') ? '!' + mods[i].getDataValue('mentionableId') : '&' + mods[i].get('mentionableId')}> (${mods[i].get('mentionableId')})\n`;
					}
					if (description.length < 20)
						description = lang.obj['settings_mods_show_none'];
					break;
				case 'channels': // /settings channels show
					title = lang.obj['settings_channels_show_title'];
					const channels = await db.listChannels(interaction.guildId);
					for (let i = 0; i < channels.length; i++) {
						description += `<#${channels[i].get('channelId')}> (${channels[i].get('channelId')})\n`;
					}
					if (description.length < 20)
						description = lang.obj['settings_channels_show_none'];
					break;
				case 'language': // /settings language show
					title = lang.obj['settings_language_show_title'];
					description = await db.getLanguageCode(interaction.guildId);
					break;
			}
			break;
		case 'set':
			subcommandgroup = interaction.options.getSubcommandGroup(false);
			switch (subcommandgroup) {
				case 'language': // /settings language set
					try {
						await db.setLanguage(interaction.guildId, interaction.options.getString('language'));
						title = lang.obj['settings_language_set_title_success'];
						description = lang.obj['settings_language_set_description_success'];
					} catch (err) {
						title = lang.obj['settings_language_set_title_failed'];
						description = `${lang.obj['settings_language_set_description_failed']}${err}`;
					}
					break;
				default:
					break;
			}
			break;
		case 'unset':
			subcommandgroup = interaction.options.getSubcommandGroup(false);
			switch (subcommandgroup) {
				case 'language': // /settings language unset
					try {
						await db.unsetLanguage(interaction.guildId);
						title = lang.obj['settings_language_unset_title_success'];
						description = lang.obj['settings_language_unset_description_success'];
					} catch (err) {
						title = lang.obj['settings_language_unset_title_failed'];
						description = `${lang.obj['settings_language_unset_description_failed']}${err}`;
					}
					break;
				default:
					break;
			}
			break;
		case 'reset': // /settings reset
			try {
				await db.resetMods(interaction.guildId);
				await db.resetChannels(interaction.guildId);
				try {
					await db.unsetLanguage(interaction.guildId);
				} catch (e) {}
				title = lang.obj['settings_reset_title_success'];
				description = lang.obj['settings_reset_description_success'];
			} catch (err) {
				title = lang.obj['settings_reset_title_failed'];
				description = `${lang.obj['settings_reset_description_failed']}${err}`;
			}
			break;
		case 'help': // /settings ? help
			subcommandgroup = interaction.options.getSubcommandGroup(false);
			switch (subcommandgroup) {
				case 'mods': // /settings mods help
					title = lang.obj['settings_mods_help'];
					description = `
					  \`/settings mods add <role or user>\` - ${lang.obj['settings_mods_add']}
					  \`/settings mods remove <role or user>\` - ${lang.obj['settings_mods_remove']}
					  \`/settings mods show\` - ${lang.obj['settings_mods_show']}`;
					break;
				case 'channels': // /settings channels help
					title = lang.obj['settings_channels_help'];
					description = `
					  \`/settings channels add <role or user>\` - ${lang.obj['settings_channels_add']}
					  \`/settings channels remove <role or user>\` - ${lang.obj['settings_channels_remove']}
					  \`/settings channels show\` - ${lang.obj['settings_channels_show']}`;
					break;
				case 'language': // /settings language help
					title = lang.obj['settings_language_help'];
					description = `
					  \`/settings language set <language code>\` - ${lang.obj['settings_language_set']}
					  \`/settings language unset\` - ${lang.obj['settings_language_unset']}
					  \`/settings language show\` - ${lang.obj['settings_language_show']}`;
					break;
				default: // /settings help
					title = lang.obj['settings_help'];
					description = `
					  \`/settings mods add <role or user>\` - ${lang.obj['settings_mods_add']}
					  \`/settings mods remove <role or user>\` - ${lang.obj['settings_mods_remove']}
					  \`/settings mods show\` - ${lang.obj['settings_mods_show']}
					  \`/settings channels add <role or user>\` - ${lang.obj['settings_channels_add']}
					  \`/settings channels remove <role or user>\` - ${lang.obj['settings_channels_remove']}
					  \`/settings channels show\` - ${lang.obj['settings_channels_show']}
					  \`/settings language set <language code>\` - ${lang.obj['settings_language_set']}
					  \`/settings language unset\` - ${lang.obj['settings_language_unset']}
					  \`/settings language show\` - ${lang.obj['settings_language_show']}
					  \`/settings reset\` - ${lang.obj['settings_reset']}
					  \`/settings show\` - ${lang.obj['settings_show']}`;
					break;
			}
			break;
	}
	// returnEmbed(title, message, image=null)
	interaction.editReply({
		embeds: [util.returnEmbed(title, description)],
		ephemeral: true
	});
}

function getRegisterObject() {
	return {
		name: 'settings',
		description: 'View or set settings in an ephemeral message',
		type: ApplicationCommandType.ChatInput,
		options: [
			{
				name: 'mods',
				description: 'View, add or remove bot mods',
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'add',
						description: 'Add a bot mod',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'mentionable',
								description: 'The user or role to add as a bot mod',
								required: true,
								type: ApplicationCommandOptionType.Mentionable
							}
						]
					},
					{
						name: 'remove',
						description: 'Remove a bot mod',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'mentionable',
								description: 'The user or role to remove from the bot mods',
								required: true,
								type: ApplicationCommandOptionType.Mentionable
							}
						]
					},
					{
						name: 'show',
						description: 'Shows the current mods',
						type: ApplicationCommandOptionType.Subcommand
					},
					{
						name: 'help',
						description: 'Shows help for mod settings',
						type: ApplicationCommandOptionType.Subcommand
					}
				]
			},
			{
				name: 'channels',
				description: 'View, add or remove channels in which the bot responds',
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'add',
						description: 'Add a channel in which the bot responds',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'channel',
								description: 'The channel in which the bot should start responding',
								required: true,
								type: ApplicationCommandOptionType.Channel
							}
						]
					},
					{
						name: 'remove',
						description: 'Remove a channel from the channels in which the bot responds',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'channel',
								description: 'The channel in which the bot should stop responding',
								required: true,
								type: ApplicationCommandOptionType.Channel
							}
						]
					},
					{
						name: 'show',
						description: 'Shows the current channels in which the bot responds',
						type: ApplicationCommandOptionType.Subcommand
					},
					{
						name: 'help',
						description: 'Shows help for mod settings',
						type: ApplicationCommandOptionType.Subcommand
					}
				]
			},
			{
				name: 'language',
				description: 'View, set or unset a preferred language',
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'set',
						description: 'Set the preferred language for this server',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'language',
								description: 'The language code of your preferred language (e.g. en_US)',
								required: true,
								type: ApplicationCommandOptionType.String
							}
						]
					},
					{
						name: 'unset',
						description: 'Unsets your preferred language for this server',
						type: ApplicationCommandOptionType.Subcommand
					},
					{
						name: 'show',
						description: 'Shows your currently set preferred language for this server',
						type: ApplicationCommandOptionType.Subcommand
					},
					{
						name: 'help',
						description: 'Shows help for language settings',
						type: ApplicationCommandOptionType.Subcommand
					}
				]
			},
			{
				name: 'reset',
				description: 'Resets the current settings',
				type: ApplicationCommandOptionType.Subcommand
			},
			{
				name: 'help',
				description: 'Shows Help for the /settings command',
				type: ApplicationCommandOptionType.Subcommand
			}
		]
	};
}

module.exports.settings = settings;
module.exports.getRegisterObject = getRegisterObject;
