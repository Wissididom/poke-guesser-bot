const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const language = require("./language.js");
const util = require("./util");

async function reveal(interaction, db) {
	await interaction.deferReply({ ephemeral: false }); // PokeBot is thinking
	if (!interaction.guild.available)
		return;
	const lang = await language.getLanguage(interaction.guildId, db);
	if (await db.isMod(interaction.member)) {
		let encounter = await db.getEncounter(interaction.guildId, interaction.channelId);
		if (encounter.length > 0) {
			let pokemonNames = [];
			let englishIndex = 0;
			for (let i = 0; i < encounter.length; i++) {
				// console.log(encounter);
				let lowercaseName = encounter[i].name.toLowerCase();
				if (!pokemonNames.includes(lowercaseName))
					pokemonNames.push(lowercaseName);
				if (encounter[i].language === 'en')
					englishIndex = i;
			}
			// build string to put in between brackets
			let inBrackets = '';
			for (let i = 0; i < pokemonNames.length; i++) {
				if (inBrackets == '')
					inBrackets = util.capitalize(pokemonNames[i]);
				else
					inBrackets += `, ${util.capitalize(pokemonNames[i])}`;
			}
			console.log(`Mod requested reveal: ${encounter[englishIndex].name} (${inBrackets})`);
			// returnEmbed(title, message, image=null)
			interaction.editReply({
				embeds: [util.returnEmbed(lang.obj['reveal_pokemon_escaped_title'], lang.obj['reveal_pokemon_escaped_description'].replace('<englishPokemon>', util.capitalize(encounter[englishIndex].name)).replace('<inBrackets>', inBrackets))],
				ephemeral: false
			});
			await db.clearEncounters(interaction.guildId, interaction.channelId);
		} else {
			// returnEmbed(title, message, image=null)
			interaction.editReply({
				embeds: [util.returnEmbed(lang.obj['reveal_no_encounter_title'], lang.obj['reveal_no_encounter_description'])],
				ephemeral: false
			});
		}
	} else {
		// returnEmbed(title, message, image=null)
		interaction.editReply({
			embeds: [util.returnEmbed(lang.obj['reveal_no_mod_title'], lang.obj['reveal_no_mod_description'])],
			ephemeral: false
		});
	}
}

function getRegisterObject() {
	return {
		name: 'reveal',
		description: 'Reveals the current pokemon',
		type: ApplicationCommandType.ChatInput
	};
}

// Exports each function separately
module.exports.reveal = reveal;
module.exports.getRegisterObject = getRegisterObject;
