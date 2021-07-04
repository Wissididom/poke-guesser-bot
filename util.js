const Discord = require("discord.js");

/*
UTILITIES
*/

// Wraps reply in poke-guesser themed embed
function embedReply(title, message, msg) {

  // Creates new embedded message
  const embed = new Discord.MessageEmbed()
    .setTitle(title)  // Adds title
    .setAuthor('POKé-GUESSER BOT', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription(message)  // Adds message
    .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');

  msg.channel.send(embed);  // Sends the embedded message back to channel

}

module.exports.embedReply = embedReply;