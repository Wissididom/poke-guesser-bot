const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/*
UTILITIES
*/

// Wraps reply in poke-guesser themed embed
function returnEmbed(title, message, color=0x00AE86, image=null) {
	// Creates new embedded message
	let embed = new EmbedBuilder()
		.setTitle(title)  // Adds title
		.setAuthor({
			name: 'POKé-GUESSER BOT',
			url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
			iconURL: 'https://github.com/GeorgeCiesinski/poke-guesser-bot'
		})
		.setColor(color)
		.setDescription(message)  // Adds message
		.setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
		.setFooter({
			text: 'By borreLore, Wissididom and Valley Orion',
			iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png'
		});

	if (image) {
		const attachment = new AttachmentBuilder(image, { name: 'pokemon.png' });
		embed.setImage('attachment://pokemon.png');
		return {
			embed,
			attachment
		}
	} else {
		return embed;
	}
}

// Capitalizes first letter of pokemon name
function capitalize(string){
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

// Finds the GuildMember by User-IDs (either string or array)
function findMember(client, ids) {
  // Return member or undefined if not found (force specifies if cache should be checked)
  // I could have omitted the force property, but i have put it there to make it clear
  return message.guild.members.fetch({ user: ids, force: false});
}

// Finds the User by User-ID
function findUser(client, id) {
  return findMember(client, id).then((member) => {
    // If member found, return member, else return null
    if (member) {
      console.log(`User ID ${id} found in guild.`);
      return member.user;
    } else {
      console.log(`WARNING: User ID ${id} not found in guild.`);
      return null;
    }
  });
}

// Checks if the User is the Server Owner or has the Administrator Permission
function isAdmin(member) {
	return member.id == member.guild.ownerId || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
}

function isUser(mentionable) {
	return mentionable.hoist == undefined;
}

function isRole(mentionable) {
	return !isUser(mentionable);
}

function generatePokemon() {
	// Fetch json of all available pokemon up to a limit of 2000 (~1200 available)
	return fetch('https://pokeapi.co/api/v2/pokemon/?limit=2000').then(res => {
		return res.json(); // Parse json
	}).then(json => {
		return json.results; // Extract results
	}).then(resultList => {
		return resultList[Math.floor(Math.random() * resultList.length)]; // Return random item from list
	});
}

// Fetches the sprite using the pokemon's api url
function fetchSprite(url) {
	return fetch(url).then(res => {
		return res.json(); // Parse json
	}).then(json => {
		return json.sprites; // returns an array of urls for the sprites
	});
}

// Fetches the pokemon's names in different languages
function fetchNames(nameOrId) {
	return fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId}/`).then(res => {
		return res.json(); // Parse json
	}).then(json => {
		return json.names; // Get names as array
	}).then(names => {
		let resultNames = [];
		for (let i = 0; i < names.length; i++) {
			resultNames.push({
				languageName: names[i].language.name,
				languageUrl: names[i].language.url,
				name: names[i].name
			});
		}
		return resultNames;
	}).catch(err => {
		// For example id 10220 returns 404 Not Found
	});
}

module.exports.returnEmbed = returnEmbed;
module.exports.capitalize = capitalize;
module.exports.findMember = findMember;
module.exports.findUser = findUser;
module.exports.isAdmin = isAdmin;
module.exports.isUser = isUser;
module.exports.isRole = isRole;
module.exports.generatePokemon = generatePokemon;
module.exports.fetchSprite = fetchSprite;
module.exports.fetchNames = fetchNames;
