import { EmbedBuilder, AttachmentBuilder, Message } from "discord.js";

/*
UTILITIES
*/

// Check Replit database on start to make sure no values are set as null
function checkDatabase(db) {
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
function instantiateDatabase(db) {
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
function embedReply(title, description, msg, image = null, actionRow = null) {
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
      text: "By borreLore, Wissididom and Crue Peregrine",
      iconURL:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
    });

  if (image) {
    const attachment = new AttachmentBuilder(image, { name: "pokemon.png" });
    embed.setImage("attachment://pokemon.png");
    if (msg instanceof Message) {
      msg.channel.send({
        embeds: [embed],
        files: [attachment],
        components: actionRow ? [actionRow] : [],
      }); // Sends the embedded message back to channel
    } else {
      msg.editReply({
        embeds: [embed],
        files: [attachment],
        components: actionRow ? [actionRow] : [],
      }); // Sends the embedded message back to channel
    }
    return;
  }

  if (msg instanceof Message)
    msg.channel.send({
      embeds: [embed],
      components: actionRow ? [actionRow] : [],
    });
  // Sends the embedded message back to channel
  else
    msg.editReply({
      embeds: [embed],
      components: actionRow ? [actionRow] : [],
    });
}

// Capitalizes first letter of pokemon name
function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

module.exports.checkDatabase = checkDatabase;
module.exports.embedReply = embedReply;
module.exports.capitalize = capitalize;
