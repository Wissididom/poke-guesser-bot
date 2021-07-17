const Discord = require("discord.js");
const Database = require("@replit/database");

const db = new Database();

/*
UTILITIES
*/

// Check Replit database on start to make sure no values are set as null
function checkDatabase() {
  // Check if database has been instantiated
  db.get("instantiated")
  .then(instantiated => {

    console.log(`Instantiated: ${instantiated}`);

    if (instantiated === true) {

      console.log("Database is ready.");

    } else if (instantiated === null) {

      instantiateDatabase();  // Set Database Keys

    } else {

      console.log("ERROR: Unexpected error occurred when performing startup check on database.")

    }
  })
}

// Set first values in database
function instantiateDatabase() {

  console.log("Instantiating database for the first time.");

  // Set blank configuration
  const configuration = {
    "configuration": {
      "channels": [],
      "roles": []
    }
  };

  db.set("configuration", JSON.stringify(configuration));

  // Set blank pokemon
  db.set("pokemon", "");

  // Set blank leaderboard
  db.set("leaderboard", {});

  // Set instantiated to True
  db.set("instantiated", true);

}

// Wraps reply in poke-guesser themed embed
function embedReply(title, message, msg, image=null) {

  // Creates new embedded message
  let embed = new Discord.MessageEmbed()
    .setTitle(title)  // Adds title
    .setAuthor('POKé-GUESSER BOT', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription(message)  // Adds message
    .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');

  if (image) {
    embed.setImage(image)
  }

  msg.channel.send(embed);  // Sends the embedded message back to channel

}

// Capitalizes first letter of pokemon name
function capitalize(string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

// Sends an embedded message with the Admin Help Instructions
function adminHelp(msg) {

  const title = "Admin Help";
  const message = `Bot moderation instructions and commands:

  - GAME PLAY -
  
  \`!explore\` - Generates a new pokemon
  \`!reveal\` - Reveals the pokemon and resets it so it cannot be guessed
  \`!leaderboard\` - Shows the current Leaderboard
  \`!new championship\` - (caution) Outputs the Leaderboard one last time, reveals winner, and starts new championship with a blank leaderboard


  - FIRST TIME SETUP -

  Make sure you have set at least one role before using this bot. If you want the bot to only reply in one or two channels, make sure you set those channels as well.

  \`!configure\` - Shows the configuration instructions`;

  embedReply(title, message, msg);
}

// Sends an embedded message with the Configuration Help Instructions
function configurationHelp(msg) {

  const title = "Configuration Help";
  const message = `It is not recommended to use the bot without configuring roles and channels first.

  See below how to add and remove roles and channels. It is recommended to copy and paste the role/channel name from the discord settings as the spelling & emojis in the names have to be exact.

  - CONFIGURATION -

  \`!show config\` - Shows the currently set roles and channels
  \`!reset config\` - Removes the currently set roles and channels and returns to default configuration

  - ROLES -
  
  These are discord server roles which are allowed to moderate the bot. If no roles are set, any user can moderate the bot, which is NOT recommended!

  \`!add role <role name>\` - Adds new role to configuration
  \`!remove role <role name>\` - Removes role from configuration
  
  - CHANNELS -
  
  These are the channels the bot is allowed to reply on. If no channels are set, bot replies on all text channels.
  
  \`!add channel <channel name>\` - Adds new channel to configuration
  \`!remove channel <channel name>\` - Removes channel from configuration`;

  embedReply(title, message, msg);
}

// Sends an embedded message with the Player Help Instructions
function playerHelp(msg) {
  
  const title = "Player Help";
  const message = `Welcome to Poké-Guesser ${msg.author}!

  The player commands are below:

  - GAME PLAY -

  \`$catch <pokémon name>\` - Guess the pokémon. If you guess correctly, your score increases by 1!
  \`$leaderboard\` - Displays the leaderboard.`;

  embedReply(title, message, msg);

}

module.exports.checkDatabase = checkDatabase;
module.exports.embedReply = embedReply;
module.exports.capitalize = capitalize;
module.exports.adminHelp = adminHelp;
module.exports.configurationHelp = configurationHelp;
module.exports.playerHelp = playerHelp;