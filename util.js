const { EmbedBuilder, AttachmentBuilder, Message } = require("discord.js");
const Database = require("./database.js");

const db = new Database();

/*
UTILITIES
*/

// Check Replit database on start to make sure no values are set as null
function checkDatabase() {
  // Check if database has been instantiated
  db.get("instantiated").then((instantiated) => {
    console.log(`Instantiated: ${JSON.stringify(instantiated)}`);

    if (instantiated === true || instantiated.ok === true) {
      console.log("Database is ready.");
    } else if (instantiated === null) {
      instantiateDatabase(); // Set Database Keys
    } else {
      console.log(
        "ERROR: Unexpected error occurred when performing startup check on database.",
      );
      instantiateDatabase(); // Set Database Keys
    }
  });
}

// Set first values in database
function instantiateDatabase() {
  console.log("Instantiating database for the first time.");

  // Set blank configuration
  const configuration = {
    configuration: {
      channels: [],
      roles: [],
    },
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
function embedReply(title, description, msg, image = null) {
  // Creates new embedded message
  let embed = new EmbedBuilder()
    .setTitle(title) // Adds title
    .setAuthor({
      name: "POKé-GUESSER BOT",
      iconURL:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
      url: "https://github.com/GeorgeCiesinski/poke-guesser-bot",
    })
    .setColor(0x00ae86)
    .setDescription(description) // Adds message
    .setThumbnail(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
    )
    .setFooter({
      text: "By borreLore, Wissididom and Valley Orion",
      iconURL:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
    });

  if (image) {
    const attachment = new AttachmentBuilder(image, { name: "pokemon.png" });
    embed.setImage("attachment://pokemon.png");
    if (msg instanceof Message)
      msg.channel.send({ embeds: [embed], files: [attachment] }); // Sends the embedded message back to channel
    else msg.editReply({ embeds: [embed], files: [attachment] }); // Sends the embedded message back to channel
    return;
  }

  if (msg instanceof Message)
    msg.channel.send({ embeds: [embed] }); // Sends the embedded message back to channel
  else msg.editReply({ embeds: [embed] });
}

// Capitalizes first letter of pokemon name
function capitalize(string) {
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
  \`!addscore <@user> <score>\` - Sets the score of user if it is not on the leaderboard, adds the score to the user's current score if the user exists on the leaderboard.
  \`!addscore <@user>\` - Adds the user to the leaderboard with 0 points (Sends error message, if the user already is on the leaderboard).
  \`!removescore <@user> <score>\` - Subtracts the given score from the user's current score (Removing the whole user if the score would go negative).
  \`!removescore <@user>\` - Removes the user from the leaderboard.


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
  \`$position\` - See your current position.
  \`$leaderboard\` - Displays the leaderboard.`;

  embedReply(title, message, msg);
}

module.exports.checkDatabase = checkDatabase;
module.exports.embedReply = embedReply;
module.exports.capitalize = capitalize;
module.exports.adminHelp = adminHelp;
module.exports.configurationHelp = configurationHelp;
module.exports.playerHelp = playerHelp;
