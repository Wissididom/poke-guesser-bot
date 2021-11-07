const Discord = require("discord.js");

// const db = new Database();

/*
UTILITIES
*/

// Check database on start to make sure no values are set as null
function checkDatabase() {
  // Check if database has been instantiated
  // TODO
}

// Set first values in database
function instantiateDatabase() {
  console.log("Instantiating database for the first time.");
  // TODO
}

// Wraps reply in poke-guesser themed embed
function returnEmbed(title, message, image=null) {

  // Creates new embedded message
  let embed = new Discord.MessageEmbed()
    .setTitle(title)  // Adds title
    .setAuthor('POKé-GUESSER BOT', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription(message)  // Adds message
    .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
    .setFooter('By borreLore, Wissididom and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');

  if (image) {
    const attachment = new Discord.MessageAttachment(image, 'pokemon.png');
    embed.attachFiles(attachment);
    embed.setImage('attachment://pokemon.png');
  }

  return embed;

}

// Capitalizes first letter of pokemon name
function capitalize(string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

module.exports.checkDatabase = checkDatabase;
module.exports.returnEmbed = returnEmbed;
module.exports.capitalize = capitalize;
