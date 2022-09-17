const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const language = require("./language.js");
const util = require("./util");

async function explore(interaction, db, preventDefer = false) {
	if (!preventDefer)
		await interaction.deferReply({ ephemeral: false }); // PokeBot is thinking
	if (!interaction.guild.available)
		return;
	const lang = await language.getLanguage(interaction.guildId, db);
	if (await db.isMod(interaction.member)) {
		console.log('Generating a new Pokemon');
		await db.clearEncounters(interaction.guildId, interaction.channelId);
		await db.unsetArtwork(interaction.guildId, interaction.channelId);
		let pokemon = await util.generatePokemon();
		await db.addEncounter(interaction.guildId, interaction.channelId, pokemon.url.replace(/.+\/(\d+)\//g, '$1'), 'id');
		util.fetchNames(pokemon.url.replace(/.+\/(\d+)\//g, '$1')).then(async names => {
			if (!names) {
				console.log(`Warning: 404 Not Found for pokemon ${pokemon.url.replace(/.+\/(\d+)\//g, '$1')}. Fetching new pokemon.`);
				explore(interaction, db, true); // Attention: Recursive
				return;
			}
			for (let name of names) {
				// Sets current pokemon (different languages) names in database
				await db.addEncounter(interaction.guildId, interaction.channelId, name.name, name.languageName) // available properties: name, languageName and languageUrl
			}
			// Gets sprite url for the reply to the command with newly generated pokemon
			let sprites = await util.fetchSprite(pokemon.url);
			let spriteUrl = sprites.front_default;
			if (!spriteUrl) {
				console.log(`Warning: front_default sprite for ${pokemon.name} is null. Fetching new pokemon.`);
				explore(interaction, db); // Attention: Recursive
				return;
			}
			let officialArtUrl = sprites.other['official-artwork'].front_default;
			console.log(spriteUrl);
			console.log(officialArtUrl);
			await db.setArtwork(interaction.guildId, interaction.channelId, officialArtUrl);
			let returnedEmbed = util.returnEmbed(lang.obj['explore_wild_pokemon_appeared_title'], lang.obj['explore_wild_pokemon_appeared_description'], 0x00AE86, spriteUrl);
			// returnEmbed(title, message, image=null)
			interaction.editReply({
				embeds: [returnedEmbed.embed],
				files: [returnedEmbed.attachment],
				ephemeral: false
			});
			await db.setLastExplore(interaction.guildId, interaction.channelId, Date.now());
		}).catch(err => {
			console.log(`Error: ${err}`);
			// returnEmbed(title, message, image=null)
			interaction.editReply({
				embeds: [util.returnEmbed(lang.obj['explore_fetch_names_failed_title'], lang.obj['explore_fetch_names_failed_description'])],
				ephemeral: false
			});
		});
	} else {
		// returnEmbed(title, message, image=null)
		interaction.editReply({
			embeds: [util.returnEmbed(lang.obj['explore_no_mod_title'], lang.obj['explore_no_mod_description'])],
			ephemeral: false
		});
	}
}

function getRegisterObject() {
	return {
		name: 'explore',
		description: 'Generates a new pokemon',
		type: ApplicationCommandType.ChatInput
	};
}

// Exports each function separately
module.exports.explore = explore;
module.exports.getRegisterObject = getRegisterObject;
