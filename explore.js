const { Constants } = require('discord.js');
const language = require("./language.js");
const util = require("./util");

// Shows User Position and Score
async function explore(interaction, db) {
	await interaction.deferReply({ ephemeral: false }); // PokeBot is thinking
	if (!interaction.guild.available)
		return;
	const lang = await language.getLanguage(interaction.guildId, db);
	let title = '';
	let description = '';
	if (await db.isMod(interaction.member)) {
		console.log('Generating a new Pokemon');
		db.clearEncounters(interaction.guildId, interaction.channelId);
		db.unsetArtwork(interaction.guildId, interaction.channelId);
		let pokemon = await util.generatePokemon();
		db.addEncounter(interaction.guildId, interaction.channelId, pokemon.url.replace(/.+\/(\d+)\//g, '$1'), 'id');
		util.fetchNames(pokemon.url.replace(/.+\/(\d+)\//g, '$1')).then(async names => {
			if (!names) {
				console.log(`Warning: 404 Not Found for pokemon ${pokemonNames[0]}. Fetching new pokemon.`);
				explore(interaction, db); // Attention: Recursive
				return;
			}
			for (let name of names) {
				// Sets current pokemon (different languages) names in database
				db.addEncounter(interaction.guildId, interaction.channelId, name.name, name.languageName) // available properties: name, languageName and languageUrl
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
			db.setArtwork(interaction.guildId, interaction.channelId, officialArtUrl);
			// returnEmbed(title, message, image=null)
			interaction.editReply({
				embeds: [util.returnEmbed(lang.obj['explore_wild_pokemon_appeared_title'], lang.obj['explore_wild_pokemon_appeared_description'], spriteUrl)],
				ephemeral: false
			});
			db.setLastExplore(interaction.guildId, interaction.channelId, Date.now());
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
		description: 'Generates a new pokemon'
	};
}

// Exports each function separately
module.exports.explore = explore;
module.exports.getRegisterObject = getRegisterObject;
