const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const Discord = require("discord.js");
const util = require("./util");

async function championship(interaction, subcommand, lang, db) {
	let response = {
		title: '',
		description: ''
	};
	switch (subcommand) {
		case 'new':
			try {
				await newChampionship(interaction.guildId);
				response.title = lang.obj['mod_championship_new_title_success'];
				response.description = lang.obj['mod_championship_new_description_success'];
			} catch (err) {
				response.title = lang.obj['mod_championship_new_title_failed'];
				response.description = `${lang.obj['mod_championship_new_description_failed']}${err}`;
			}
			break;
	}
	return response;
}

async function newChampionship(serverId) {
	// TODO: Execute Mod Actions
}

function getRegisterObject() {
	return {
		name: 'championship',
		description: 'Manages the championship',
		type: ApplicationCommandOptionType.SubcommandGroup,
		options: [
			{
				name: 'new',
				description: 'Outputs the leaderboard one last time, reveals winner and clears the leaderboard',
				type: ApplicationCommandOptionType.Subcommand
			}
		]
	};
}

// Exports each function separately
module.exports.championship = championship;
module.exports.getRegisterObject = getRegisterObject;
