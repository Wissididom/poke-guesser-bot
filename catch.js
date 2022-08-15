const { Constants } = require('discord.js');
const language = require('./language.js');
const util = require('./util.js');

let guessEntered = false;

async function _catch(interaction, db) {
	guessEntered = true; // Lock catch until complete
	const guess = interaction.options.getString('pokemon');
	console.log(`${interaction.user.tag} guessed ${guess}`);
	if (!interaction.guild.available)
		return;
	const lang = await language.getLanguage(interaction.guildId, db);
	// TODO: Disadvantages like delay and timeout
	let encounter = await db.getEncounter(interaction.guildId, interaction.channelId);
	if (encounter.length > 0) {
		let guessed = false;
		// Loop though pokemon names and check against guess
		for (let i = 0; i < encounter.length; i++) {
			if (encounter[i].name.toLowerCase() === guess.toLowerCase()) {
				await db.clearEncounters(interaction.guildId, interaction.channelId);
				let artwork = await db.getArtwork(interaction.guildId, interaction.channelId);
				await db.addScore(interaction.guildId, interaction.member.id, 1);
				let englishIndex = 0;
				for (let i = 0; i < encounter.length; i++) {
					if (encounter[i].language === 'en')
						englishIndex = i;
				}
				// Send message that guess is correct
				let title = '';
				if (encounter[i].name.toLowerCase() === encounter[englishIndex].name.toLowerCase())
					title = lang.obj['catch_caught_english_title'].replace('<pokemon>', util.capitalize(encounter[englishIndex].name));
				else
					title = lang.obj['catch_caught_other_language_title'].replace('<englishPokemon>', util.capitalize(encounter[englishIndex].name)).replace('<guessedPokemon>', util.capitalize(encounter[i].name));
				console.log(`catch.js-artwork:${artwork}`);
				let returnedEmbed = util.returnEmbed(title, lang.obj['catch_caught_description'].replace('<guesser>', `<@${interaction.member.id}>`), 0x00AE86, artwork);
				// returnEmbed(title, message, image=null)
				interaction.reply({
					embeds: [returnedEmbed.embed],
					files: [returnedEmbed.attachment],
					ephemeral: false
				});
				guessed = true;
				await db.unsetArtwork(interaction.guildId, interaction.channelId);
				guessEntered = false; // Reset guessEntered
				break;
			}
		}
		if (!guessed) {
			interaction.reply({
				embeds: [util.returnEmbed(lang.obj['catch_guess_incorrect_title'], lang.obj['catch_guess_incorrect_description'])],
				ephemeral: true
			});
		}
	} else {
		// returnEmbed(title, message, image=null)
		interaction.reply({
			embeds: [util.returnEmbed(lang.obj['catch_no_encounter_title'], lang.obj['catch_no_encounter_description'])],
			ephemeral: true
		});
		guessEntered = false; // Reset guessEntered
	}
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
