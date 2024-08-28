require("dotenv").config();
/*
LIBRARIES
*/

const {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
} = require("discord.js");
const Database = require("./database.js");

/*
IMPORTED FUNCTIONS
*/
const util = require("./util");
const pokeFetch = require("./pokemon");
const leaderBoard = require("./leaderboard");
const configure = require("./configure");
const disadvantages = require("./disadvantages");

/*
OBJECTS, TOKENS, GLOBAL VARIABLES
*/

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
}); // Discord Object

const db = new Database(); // Replit Database

const mySecret = process.env["TOKEN"]; // Discord Token

let guessEntered = false;

/*
ADMIN COMMANDS

checkCommand() checks any command inputted after !

Any functions called by checkCommand() should either be organized in one of the imported files, or should be placed below checkCommand() if it doesn't belong in the other files. 
*/

// Checks command, calls appropriate function
function checkCommand(command, msg) {
  // If command is ping, reply with bot status
  if (command === "ping") {
    const title = "Pong!";
    const message = "Beep-boop! Poke-guesser-bot is running!";
    util.embedReply(title, message, msg);
  }

  // Admin Help
  if (command === "help") {
    util.adminHelp(msg);
  }

  // Configuration Help
  if (command === "configure") {
    util.configurationHelp(msg);
  }

  /*
  Configuration Utilities
  */

  // Displays configuration settings
  if (command === "show config") {
    configure.showConfig(msg);
  }

  // Resets configuration to default settings
  if (command === "reset config") {
    configure.resetConfig(msg);
  }

  /*
  Configuration Roles
  */

  // Replies to channel with available roles
  if (command === "roles") {
    configure.roles(msg);
  }

  // Adds role to configuration
  if (command.startsWith("add role ")) {
    role = msg.content.split("add role ")[1];
    configure.addRole(role, msg);
  }

  // Removes role from configuration
  if (command.startsWith("remove role ")) {
    role = msg.content.split("remove role ")[1];
    configure.removeRole(role, msg);
  }

  /*
  Configuration Channels
  */

  // Replies to channel with available text channels
  if (command === "channels") {
    configure.channels(msg);
  }

  // Adds channel to configuration
  if (command.startsWith("add channel ")) {
    channel = msg.content.split("add channel ")[1];
    configure.addChannel(channel, msg);
  }

  // Removes channel from configuration
  if (command.startsWith("remove channel ")) {
    channel = msg.content.split("remove channel ")[1];
    configure.removeChannel(channel, msg);
  }

  /*
  Game Controls
  */

  // Output the leaderboard
  if (command === "leaderboard") {
    leaderBoard.showLeaderboard(msg);
  }

  // Output the leaderboard with debug
  if (command === "leaderboard debug") {
    leaderBoard.showLeaderboard(msg, true);
  }

  // Start a new championship
  if (command === "new championship") {
    leaderBoard.newChampionship(msg);
  }

  // DEBUGGING - creates a dummy leaderboard with made up usernames
  if (command === "dummy") {
    leaderBoard.dummyLeaderboard(msg);
  }

  // DEBUGGING - resets leaderboard to default (empty) values
  if (command === "empty") {
    leaderBoard.emptyLeaderboard(msg);
  }

  // Sets a delay before guessing
  if (command.startsWith("delay ")) {
    const info = msg.content
      .replace(/!delay +<@!?(\d+)> *(\d+)?/g, "$1-$2")
      .split("-");
    const userId = info[0];
    if (parseInt(info[1]) === NaN) {
      // [<hours>h][<minutes>m][<seconds>s]
      // Source: https://codereview.stackexchange.com/questions/224931/convert-a-string-like-4h53m12s-to-a-total-number-of-seconds-in-javascript/224948
      const {
        groups: { h = 0, m = 0, s = 0 },
      } = /(?<h>\d*)h(?<m>\d*)m(?<s>\d*)/i.exec(info[1]);
      disadvantages.setDelay(userId, parseInt(h), parseInt(m), parseInt(s));
    } else {
      // Seconds
      disadvantages.setDelay(userId, 0, 0, parseInt(info[1]));
    }
    util.embedReply(
      "Delay Set",
      `The Delay of <@!${userId}> was set to ` + info[1] + " seconds",
      msg,
    );
  }

  // Unsets a delay for the specified user
  if (command.startsWith("undelay ")) {
    const info = msg.content.replace(/!undelay +<@!?(\d+)> */g, "$1");
    const userId = info;
    disadvantages.unsetDelay(userId);
    util.embedReply(
      "Delay Unset",
      `The Delay of <@!${userId}> was removed`,
      msg,
    );
  }

  // Unsets a delay for the specified user
  if (command.startsWith("showdelay ")) {
    const userId = msg.content.replace(/!showdelay +<@!?(\d+)> */g, "$1");
    disadvantages.getDelayInSeconds(userId).then((delaySeconds) => {
      if (delaySeconds < 0) {
        util.embedReply(
          "Show Delay",
          `<@!${userId}> doesn't have a delay!`,
          msg,
        );
      } else {
        let totalSeconds = delaySeconds;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        util.embedReply(
          "Show Delay",
          `The Delay of <@!${userId}> is ${hours}h${minutes}m${seconds}s (Total: ${delaySeconds} Seconds)`,
          msg,
        );
      }
    });
  }

  if (command.startsWith("timeout ")) {
    const info = msg.content
      .replace(/!timeout +<@!?(\d+)> +([\d\/]+) +([\d\/]+) */g, "$1-$2-$3")
      .split("-");
    const userId = info[0];
    const startDateTime = info[1];
    const endDateTime = info[2];
    disadvantages.setTimeout(userId, startDateTime, endDateTime);
    util.embedReply(
      "Timeout Set",
      `The Timeout of <@!${userId}> is starting at ${startDateTime} and ending at ${endDateTime} (both in UTC)`,
      msg,
    );
  }

  if (command.startsWith("untimeout ")) {
    const userId = msg.content.replace(/!untimeout +<@!?(\d+)> */g, "$1");
    disadvantages.unsetTimeout(userId);
    util.embedReply(
      "Timeout Unset",
      `The Timeout of <@!${userId}> was removed`,
      msg,
    );
  }

  if (command.startsWith("showtimeout ")) {
    const userId = msg.content.replace(/!showtimeout +<@!?(\d+)> */g, "$1");
    disadvantages.getTimeout(userId).then((timeout) => {
      if (timeout) {
        util.embedReply(
          "Show Timeout",
          `The Timeout of <@!${userId}> is starting at ${timeout.start} and ending at ${timeout.start} (both in UTC)`,
          msg,
        );
      } else {
        util.embedReply(
          "Show Timeout",
          `The User <@!${userId}> doesn't have a timeout!`,
          msg,
        );
      }
    });
  }
}

/*
PLAYER COMMANDS

checkInput() checks any command inputted after $

Any functions called by checkInput() should either be organized in one of the imported files, or should be placed below checkInput() if it doesn't belong in the other files. 
*/

// Checks pokemon guess
function checkInput(inputRequest, msg) {
  // Player Help
  if (inputRequest === "help") {
    util.playerHelp(msg);
  }

  // Player Guess
  if (inputRequest.startsWith("catch ") && guessEntered === false) {
    guessEntered = true; // Lock catch until complete

    guess = msg.content.split("catch ")[1]; // Splits at the command, gets pokemon name guess
    console.log(`${msg.author} guessed ${guess}.`);

    let promises = [
      disadvantages.getDelayInSeconds(msg.author.id),
      disadvantages.getTimeout(msg.author.id),
      db.get("lastExplore"),
    ];
    Promise.all(promises).then(([delay, timeout, lastExplore]) => {
      console.log(`delay:${delay};lastExplore:${lastExplore}`);
      if (Date.now() - lastExplore < delay * 1000) {
        util.embedReply(
          "Delayed",
          "You are delayed for another " +
            (delay * 1000 - (Date.now() - lastExplore)) / 1000 +
            " Seconds!",
          msg,
        );
        msg.delete();
        guessEntered = false;
        return;
      }
      if (timeout) {
        const splittedStart = timeout.start.split(/\//g);
        const now = new Date();
        const defaults = {
          year: 0 /*now.getUTCFullYear()*/,
          month: 0 /*now.getUTCMonth()*/,
          day: 1 /*now.getUTCDate()*/,
          hour: 0 /*now.getUTCHours()*/,
          minute: 0 /*now.getUTCMinutes()*/,
          second: 0 /*now.getUTCSeconds()*/,
          millisecond: 0 /*now.getUTCMilliseconds()*/,
        };
        const start = {
          year: parseInt(splittedStart[0]) | defaults.year,
          month: (parseInt(splittedStart[1]) - 1) | defaults.month,
          day: parseInt(splittedStart[2]) | defaults.day,
          hour: parseInt(splittedStart[3]) | defaults.hour,
          minute: parseInt(splittedStart[4]) | defaults.minute,
          second: parseInt(splittedStart[5]) | defaults.second,
          millisecond: parseInt(splittedStart[6]) | defaults.millisecond,
        };
        const startTime = Date.UTC(
          start.year,
          start.month,
          start.day,
          start.hour,
          start.minute,
          start.second,
          start.millisecond,
        );
        const splittedEnd = timeout.end.split(/\//g);
        const end = {
          year: parseInt(splittedEnd[0]) | defaults.year,
          month: (parseInt(splittedEnd[1]) - 1) | defaults.month,
          day: parseInt(splittedEnd[2]) | defaults.day,
          hour: parseInt(splittedEnd[3]) | defaults.hour,
          minute: parseInt(splittedEnd[4]) | defaults.minute,
          second: parseInt(splittedEnd[5]) | defaults.second,
          millisecond: parseInt(splittedEnd[6]) | defaults.millisecond,
        };
        const endTime = Date.UTC(
          end.year,
          end.month,
          end.day,
          end.hour,
          end.minute,
          end.second,
          end.millisecond,
        );
        const nowTime = now.getTime();
        if (nowTime > startTime && nowTime < endTime) {
          // In Timeout
          console.log(
            `In Timeout: ${nowTime} > ${startTime} && ${nowTime} < ${endTime}`,
          );
          util.embedReply(
            "Timeouted",
            "You are still timeouted until " + timeout.end,
            msg,
          );
          msg.delete();
          guessEntered = false;
          return;
        } else {
          // Out of Timeout
          console.log(
            `Out of Timeout: !(${nowTime} > ${startTime} && ${nowTime} < ${endTime})`,
          );
          disadvantages.unsetTimeout(msg.author.id);
        }
      }
      // Checks if the guess is part of the pokemon name
      db.get("pokemon").then((pokemon) => {
        // If no pokemon set
        if (pokemon === "") {
          console.log("No pokemon set.");

          guessEntered = false; // Reset guessEntered

          return;
        }
        // Loop through pokemon names and check against guess
        console.log(`pokemon:${JSON.stringify(pokemon)}`);
        for (let i = 0; i < pokemon.length; i++) {
          if (
            pokemon[i].name
              ? pokemon[i].name.toLowerCase() === guess.toLowerCase()
              : pokemon[i].toLowerCase() === guess.toLowerCase()
          ) {
            db.set("pokemon", ""); // Sets current pokemon to empty string

            db.get("artwork").then(async (artwork) => {
              // Send msg to addScore - id will be extrapolated
              leaderBoard.addScore(msg);
              // Find english index
              let englishIndex = 1;
              for (let i = 0; i < pokemon.length; i++) {
                if (pokemon[i].languageName === "en") englishIndex = i;
              }
              // Send message that guess is correct
              if (
                (pokemon[i].name
                  ? pokemon[i].name
                  : pokemon[i]
                ).toLowerCase() === pokemon[englishIndex].name.toLowerCase()
              )
                title = `${util.capitalize(pokemon[englishIndex].name)} has been caught!`;
              else
                title = `${util.capitalize(pokemon[englishIndex].name)} (${util.capitalize(pokemon[i].name ? pokemon[i].name : pokemon[i])}) has been caught!`;
              message = `1 point added to ${msg.author}'s score.'
              
              \`$position\`: see your current position
              \`$leaderboard\`: see the updated leaderboard`;
              await util.embedReply(title, message, msg, artwork);
              await msg.channel.messages
                .fetch({ limit: 100 })
                .then(async (messages) => {
                  const botMessage = messages.find(
                    (innerMsg) => innerMsg.author.id == msg.client.user.id,
                  );
                  if (botMessage) {
                    try {
                      botMessage.edit({
                        components: [],
                      });
                    } catch (err) {
                      // Ignore if it doesn't work, because that is prohbably just because the message has neither embed nor content
                      // Assuming it is a deferred interaction message
                    }
                  }
                })
                .catch((err) => {
                  console.error(
                    "Failed to fetch most recent messages to remove the components:",
                    err,
                  );
                });
            });
            break; // To avoid scoring multiple times
          }
        }
        guessEntered = false; // Reset guessEntered
      });
    });
  }

  // Display Leaderboard
  if (inputRequest === "leaderboard") {
    leaderBoard.showLeaderboard(msg);
  }

  // Display Position
  if (inputRequest.startsWith("position")) {
    leaderBoard.position(msg);
  }
}

/*
BOT ON

This section runs when the bot is logged in and listening for commands. First, it writes a log to the console indicating it is logged in. Next, it listens on the server and determines whether a message starts with ! or $ before calling either the Admin checkCommand function, or the User checkInput function.
*/

// Outputs console log when bot is logged in
client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`); // Logging
});

// Reads user messages, interprets commands & guesses, and authenticates channels/roles
client.on(Events.MessageCreate, (msg) => {
  // Returns if message is from bot
  if (msg.author.bot) return;

  // Authenticate if bot is allowed to reply on this channel
  configure.authenticateChannel(msg).then((authorized) => {
    // Returns if channel is not in config
    if (authorized === false) return;

    // Check if user message starts with ! indicating command, call checkCommand
    if (msg.content.startsWith("!")) {
      // Authenticate if user is authorized
      configure.authenticateRole(msg).then((authorized) => {
        if (authorized) {
          command = msg.content.split("!")[1];
          checkCommand(command, msg);
        }
      });
    }

    // Check if user message starts with $ indicating guess, call checkGuess
    if (msg.content.startsWith("$")) {
      inputRequest = msg.content.split("$")[1];
      console.log(`player command:${inputRequest}`);
      checkInput(inputRequest, msg);
    }
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  await interactionCreate(interaction);
});

let interactionCreate = async (interaction) => {
  if (interaction.isModalSubmit()) return;
  if (interaction.isButton()) {
    if (interaction.customId == "catchBtn") {
      let modal = new ModalBuilder()
        .setTitle("Catch This Pokémon!")
        .setCustomId("catchModal")
        .setComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setCustomId("guess")
              .setLabel("Pokémon Name")
              .setStyle(TextInputStyle.Short),
          ),
        );
      await interaction.showModal(modal);
      let submitted = await interaction
        .awaitModalSubmit({
          filter: (i) =>
            i.customId == "catchModal" && i.user.id == interaction.user.id,
          time: 60000,
        })
        .catch((err) => {
          console.error(err);
        });
      if (submitted) {
        if (await catchModalSubmitted(interaction, submitted, db)) {
          await interaction.editReply({
            //embeds: interaction.message.embeds,
            components: [],
          });
        }
      }
    }
    return;
  }
  if (!interaction.deferred) await interaction.deferReply();
  let channelAllowed = await configure.authenticateChannel(interaction);
  if (channelAllowed) {
    let roleAllowed = await configure.authenticateRole(interaction);
    let pokemon = null;
    switch (interaction.commandName) {
      case "explore":
        console.log("Generating a new pokemon.");
        // Returns pokemon json object
        pokemon = await pokeFetch.generatePokemon();
        let pokemonNames = [pokemon.url.replace(/.+\/(\d+)\//g, "$1")];
        let names = await pokeFetch.fetchNames(pokemonNames[0]);
        if (!names) {
          console.log(
            `Warning: 404 Not Found for pokemon ${pokemonNames[0]}. Fetching new pokemon.`,
          );
          await interactionCreate(interaction);
          return;
        }
        for (let name of names) {
          pokemonNames.push(name); // available properties: name, languageName and languageUrl
        }
        console.log(pokemonNames);
        db.set("pokemon", pokemonNames); // Sets current pokemon (different languages) names in database
        // Gets sprite url, and replies to the channel with newly generated pokemon
        let sprites = await pokeFetch.fetchSprite(pokemon.url);
        const spriteUrl = sprites.front_default;
        if (!spriteUrl) {
          console.log(
            `Warning: front_default sprite for ${pokemon.name} is null. Fetching new pokemon.`,
          );
          interactionCreate(interaction);
          return;
        }
        const officialArtUrl = sprites.other["official-artwork"].front_default;
        console.log(spriteUrl);
        console.log(officialArtUrl);
        // Set official artwork url in database
        db.set("artwork", officialArtUrl); // Sets official art url in database
        const title = "A wild POKEMON appeared!";
        const message =
          "Type `$catch _____` with the correct pokemon name to catch this pokemon!";
        let actionRow = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("catchBtn")
            .setLabel("Catch This Pokémon!")
            .setStyle(ButtonStyle.Primary),
        );
        util.embedReply(title, message, interaction, spriteUrl, actionRow);
        db.set("lastExplore", Date.now());
        break;
      case "reveal":
        pokemon = await db.get("pokemon");
        if (pokemon === "") {
          console.log(
            "Admin requested reveal, but no pokemon is currently set.",
          );
          const title = "There is no pokemon to reveal";
          const message =
            "You have to explore to find a pokemon. Type `!explore` to find a new pokemon.";
          util.embedReply(title, message, interaction);
        } else {
          let pokemonNames = [pokemon[0]];
          for (let i = 1; i < pokemon.length; i++) {
            let lowercaseName = pokemon[i].name.toLowerCase();
            if (!pokemonNames.includes(lowercaseName))
              pokemonNames.push(lowercaseName.toLowerCase());
          }

          let englishIndex = 0; // Find english index
          for (let i = 1; i < pokemon.length; i++) {
            if (pokemon[i].languageName === "en") englishIndex = i;
          }

          // build string to put in between brackets
          let inBrackets = "";
          for (let i = 0; i < pokemonNames.length; i++) {
            if (inBrackets == "") inBrackets = util.capitalize(pokemonNames[i]);
            else inBrackets += ", " + util.capitalize(pokemonNames[i]);
          }
          console.log(
            `Admin requested reveal: ${pokemon[englishIndex].name} (${inBrackets})`,
          );
          const title = "Pokemon escaped!";
          const message = `As you approached, the pokemon escaped, but you were able to catch a glimpse of ${util.capitalize(pokemon[englishIndex].name)} (${inBrackets}) as it fled.`;
          await db.set("pokemon", ""); // Sets current pokemon to empty string
          await interaction.channel.messages
            .fetch({ limit: 100 })
            .then(async (messages) => {
              const botMessage = messages.find(
                (msg) =>
                  msg.author.id == interaction.client.user.id &&
                  msg.interaction?.commandName != "reveal",
              );
              if (botMessage) {
                try {
                  await botMessage.edit({
                    components: [],
                  });
                } catch (err) {
                  // Ignore if it doesn't work, because that is prohbably just because the message has neither embed nor content
                  // Assuming it is a deferred interaction message
                }
              }
            })
            .catch((err) => {
              console.error(
                "Failed to fetch most recent messages to remove the components:",
                err,
              );
            });
          await util.embedReply(title, message, interaction);
        }
        break;
      case "leaderboard":
        leaderBoard.showLeaderboard(interaction);
        break;
      case "mod":
        await mod(interaction, db);
        break;
    }
  } else {
    await interaction.editReply({
      content: "Channel not allowed",
    });
  }
};

async function mod(interaction, db) {
  const subcommandgroup = interaction.options.getSubcommandGroup();
  const subcommand = interaction.options.getSubcommand();
  switch (subcommandgroup) {
    case "score": // /mod score ?
      // See default case
      break;
    case "delay": // /mod delay ?
      // TODO
      break;
    case "timeout": // /mod timeout ?
      // TODO
      break;
    case "championship": // /mod championship ?
      // TODO
      break;
    default:
      switch (subcommand) {
        case "score":
          let user = interaction.options.getUser("user") || interaction.user;
          let action = interaction.options.getString("action");
          let amount = interaction.options.getInteger("amount");
          switch (action) {
            case "add":
              await leaderBoard.addUser(interaction);
              break;
            case "remove":
              await leaderBoard.removeUser(interaction);
              break;
            case "set":
              // TODO
              break;
            default:
              let defaultEmbed = new EmbedBuilder()
                .setTitle("Invalid action")
                .setAuthor({
                  name: "POKé-GUESSER BOT",
                  iconURL:
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
                  url: "https://github.com/GeorgeCiesinski/poke-guesser-bot",
                })
                .setColor(0x00ae86)
                .setDescription(
                  `You used an invalid \`/mod score <action>\` action (${action})`,
                )
                .setThumbnail(
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
                )
                .setImage(artwork)
                .setFooter({
                  text: "By borreLore, Wissididom and Valley Orion",
                  iconURL:
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
                });
              await interaction.editReply({
                embeds: [embed],
              });
              break;
          }
      }
      break;
  }
}

async function catchModalSubmitted(btnInteraction, modalInteraction, db) {
  await modalInteraction.deferUpdate(); //PokeBot is thinking
  guessEntered = true;
  const guess = modalInteraction.fields.getTextInputValue("guess");
  console.log(`${modalInteraction.user.tag} guessed ${guess}`);
  if (
    (modalInteraction.guild && !modalInteraction.guild.available) ||
    !modalInteraction.guild
  )
    return;
  let promises = [
    disadvantages.getDelayInSeconds(btnInteraction.user.id),
    disadvantages.getTimeout(btnInteraction.user.id),
    db.get("lastExplore"),
  ];
  Promise.all(promises).then(([delay, timeout, lastExplore]) => {
    console.log(`delay:${delay};lastExplore:${lastExplore}`);
    if (Date.now() - lastExplore < delay * 1000) {
      let embed = new EmbedBuilder()
        .setTitle("Delayed")
        .setAuthor({
          name: "POKé-GUESSER BOT",
          iconURL:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
          url: "https://github.com/GeorgeCiesinski/poke-guesser-bot",
        })
        .setColor(0x00ae86)
        .setDescription(
          "You are delayed for another " +
            (delay * 1000 - (Date.now() - lastExplore)) / 1000 +
            " seconds!",
        )
        .setThumbnail(
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
        )
        .setFooter({
          text: "By borreLore, Wissididom and Valley Orion",
          iconURL:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
        });
      btnInteraction.followUp({
        embeds: [embed],
      });
      guessEntered = false;
      return;
    }
    if (timeout) {
      const splittedStart = timeout.start.split(/\//g);
      const now = new Date();
      const defaults = {
        year: 0 /*now.getUTCFullYear()*/,
        month: 0 /*now.getUTCMonth()*/,
        day: 1 /*now.getUTCDate()*/,
        hour: 0 /*now.getUTCHours()*/,
        minute: 0 /*now.getUTCMinutes()*/,
        second: 0 /*now.getUTCSeconds()*/,
        millisecond: 0 /*now.getUTCMilliseconds()*/,
      };
      const start = {
        year: parseInt(splittedStart[0]) | defaults.year,
        month: (parseInt(splittedStart[1]) - 1) | defaults.month,
        day: parseInt(splittedStart[2]) | defaults.day,
        hour: parseInt(splittedStart[3]) | defaults.hour,
        minute: parseInt(splittedStart[4]) | defaults.minute,
        second: parseInt(splittedStart[5]) | defaults.second,
        millisecond: parseInt(splittedStart[6]) | defaults.millisecond,
      };
      const startTime = Date.UTC(
        start.year,
        start.month,
        start.day,
        start.hour,
        start.minute,
        start.second,
        start.millisecond,
      );
      const splittedEnd = timeout.end.split(/\//g);
      const end = {
        year: parseInt(splittedEnd[0]) | defaults.year,
        month: (parseInt(splittedEnd[1]) - 1) | defaults.month,
        day: parseInt(splittedEnd[2]) | defaults.day,
        hour: parseInt(splittedEnd[3]) | defaults.hour,
        minute: parseInt(splittedEnd[4]) | defaults.minute,
        second: parseInt(splittedEnd[5]) | defaults.second,
        millisecond: parseInt(splittedEnd[6]) | defaults.millisecond,
      };
      const endTime = Date.UTC(
        end.year,
        end.month,
        end.day,
        end.hour,
        end.minute,
        end.second,
        end.millisecond,
      );
      const nowTime = now.getTime();
      if (nowTime > startTime && nowTime < endTime) {
        // In Timeout
        console.log(
          `In Timeout: ${nowTime} > ${startTime} && ${nowTime} < ${endTime}`,
        );
        util.embedReply(
          "Timeouted",
          "You are still timeouted until " + timeout.end,
          msg,
        );
        msg.delete();
        guessEntered = false;
        return;
      } else {
        // Out of Timeout
        console.log(
          `Out of Timeout: !(${nowTime} > ${startTime} && ${nowTime} < ${endTime})`,
        );
        disadvantages.unsetTimeout(msg.author.id);
      }
    }
    // Checks if the guess is part of the pokemon name
    db.get("pokemon").then(async (pokemon) => {
      // If no pokemon set
      if (pokemon === "") {
        console.log("No pokemon set.");

        guessEntered = false; // Reset guessEntered

        return;
      }
      // Loop through pokemon names and check against guess
      console.log(`pokemon:${JSON.stringify(pokemon)}`);
      let correct = false;
      for (let i = 0; i < pokemon.length; i++) {
        if (
          pokemon[i].name
            ? pokemon[i].name.toLowerCase() === guess.toLowerCase()
            : pokemon[i].toLowerCase() === guess.toLowerCase()
        ) {
          db.set("pokemon", ""); // Sets current pokemon to empty string
          await db.get("artwork").then(async (artwork) => {
            // Send msg to addScore - id will be extrapolated
            leaderBoard.addScore(btnInteraction);
            // Find english index
            let englishIndex = 1;
            for (let i = 0; i < pokemon.length; i++) {
              if (pokemon[i].languageName === "en") englishIndex = i;
            }
            // Send message that guess is correct
            if (
              (pokemon[i].name ? pokemon[i].name : pokemon[i]).toLowerCase() ===
              pokemon[englishIndex].name.toLowerCase()
            )
              title = `${util.capitalize(pokemon[englishIndex].name)} has been caught!`;
            else
              title = `${util.capitalize(pokemon[englishIndex].name)} (${util.capitalize(pokemon[i].name ? pokemon[i].name : pokemon[i])}) has been caught!`;
            message = `1 point added to ${btnInteraction.user}'s score.'
                          
                          \`$position\`: see your current position
                          \`$leaderboard\`: see the updated leaderboard`;
            let embed = new EmbedBuilder()
              .setTitle(title)
              .setAuthor({
                name: "POKé-GUESSER BOT",
                iconURL:
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
                url: "https://github.com/GeorgeCiesinski/poke-guesser-bot",
              })
              .setColor(0x00ae86)
              .setDescription(message)
              .setThumbnail(
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
              )
              .setImage(artwork)
              .setFooter({
                text: "By borreLore, Wissididom and Valley Orion",
                iconURL:
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
              });
            let followUpMsg = await btnInteraction.followUp({
              embeds: [embed],
            });
            await btnInteraction.channel.messages
              .fetch({ limit: 100 })
              .then(async (messages) => {
                const botMessage = messages.find(
                  (msg) =>
                    msg.author.id == btnInteraction.client.user.id &&
                    msg.id != followUpMsg.id,
                );
                if (botMessage) {
                  try {
                    await botMessage.edit({
                      components: [],
                    });
                  } catch (err) {
                    // Ignore if it doesn't work, because that is prohbably just because the message has neither embed nor content
                    // Assuming it is a deferred interaction message
                  }
                }
              })
              .catch((err) => {
                console.error(
                  "Failed to fetch most recent messages to remove the components:",
                  err,
                );
              });
            correct = true;
          });
          break; // To avoid scoring multiple times
        }
      }
      guessEntered = false; // Reset gues
      if (!correct) {
        await btnInteraction.followUp({
          content: `Incorrect guess (\`${guess}\`)`,
          ephemeral: true,
        });
      }
    });
  });
}

/*
BOT START CODE (login, start server, etc)

This section checks if there is a TOKEN secret and uses it to login if it is found. If not, the bot outputs a log to the console and terminates.
*/

if (mySecret === undefined) {
  console.log(
    "TOKEN not found! You must setup the Discord TOKEN as per the README file before running this bot.",
  );

  process.kill(process.pid, "SIGTERM"); // Kill Bot
} else {
  // Check database on start (prevents null errors)
  util.checkDatabase();

  // Logs in with secret TOKEN
  client.login(mySecret);
}
