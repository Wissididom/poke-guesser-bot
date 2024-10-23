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

const db = new Database(); // SQLite Database

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

  // Start a new championship
  if (command === "new championship") {
    leaderBoard.newChampionship(msg);
  }

  // DEBUGGING - resets leaderboard to default (empty) values
  if (command === "empty") {
    leaderBoard.emptyLeaderboard(msg);
  }
}

/*
PLAYER COMMANDS

checkInput() checks any command inputted after $

Any functions called by checkInput() should either be organized in one of the imported files, or should be placed below checkInput() if it doesn't belong in the other files. 
*/

// Checks pokemon guess
function checkInput(inputRequest, msg) {
  // Player Guess
  if (inputRequest.startsWith("catch ") && guessEntered === false) {
    guessEntered = true; // Lock catch until complete

    guess = msg.content.split("catch ")[1]; // Splits at the command, gets pokemon name guess
    console.log(`${msg.author} guessed ${guess}.`);
    db.get("lastExplore").then((lastExplore) => {
      console.log(`lastExplore:${lastExplore}`);
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
        .setCustomId(`catchModal-${interaction.id}`)
        .setComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setCustomId("guess")
              .setLabel("Pokémon Name")
              .setStyle(TextInputStyle.Short),
          ),
        );
      await interaction.showModal(modal);
      try {
        let submitted = await interaction
          .awaitModalSubmit({
            filter: (i) =>
              i.customId == `catchModal-${interaction.id}` &&
              i.user.id == interaction.user.id,
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
        console.log(`Submitted Type: ${submitted.type}`);
      } catch (e) {
        console.error("Timed out", e);
        interaction.followUp({
          content: "Modal timed out (> 60 seconds)",
          ephemeral: true,
        });
      }
    }
    return;
  }
  if (!interaction.deferred) {
    if (interaction.commandName == "mod") {
      await interaction.deferReply({ ephemeral: true });
    } else {
      await interaction.deferReply({ ephemeral: false });
    }
  }
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
              await leaderBoard.setUser(interaction);
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
                  text: "By borreLore, Wissididom and Crue Peregrine",
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
  db.get("lastExplore").then((lastExplore) => {
    console.log(`lastExplore:${lastExplore}`);
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
                text: "By borreLore, Wissididom and Crue Peregrine",
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
  await db.initDb();
  // Check database on start (prevents null errors)
  util.checkDatabase(db);

  // Logs in with secret TOKEN
  client.login(mySecret);
}
