require("dotenv").config();
/*
LIBRARIES
*/

const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const Database = require("./database.js");

/*
IMPORTED FUNCTIONS
*/
const keepAlive = require("./server");
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

  // Generate new pokemon
  if (command === "explore") {
    console.log("Generating a new pokemon.");
    // Returns pokemon json object
    pokeFetch.generatePokemon().then((pokemon) => {
      // Set first item to pokedex id
      let pokemonNames = [pokemon.url.replace(/.+\/(\d+)\//g, "$1")];
      pokeFetch.fetchNames(pokemonNames[0]).then((names) => {
        if (!names) {
          console.log(
            `Warning: 404 Not Found for pokemon ${pokemonNames[0]}. Fetching new pokemon.`,
          );
          checkCommand(command, msg);
          return;
        }
        for (let name of names) {
          pokemonNames.push(name); // available properties: name, languageName and languageUrl
        }
        console.log(pokemonNames);
        db.set("pokemon", pokemonNames); // Sets current pokemon (different languages) names in database
        // Gets sprite url, and replies to the channel with newly generated pokemon
        pokeFetch.fetchSprite(pokemon.url).then((sprites) => {
          // Extract sprite and official artwork
          const spriteUrl = sprites.front_default;
          if (!spriteUrl) {
            console.log(
              `Warning: front_default sprite for ${pokemon.name} is null. Fetching new pokemon.`,
            );
            checkCommand(command, msg);
            return;
          }
          const officialArtUrl =
            sprites.other["official-artwork"].front_default;
          console.log(spriteUrl);
          console.log(officialArtUrl);
          // Set official artwork url in database
          db.set("artwork", officialArtUrl); // Sets official art url in database
          const title = "A wild POKEMON appeared!";
          const message =
            "Type `$catch _____` with the correct pokemon name to catch this pokemon!";
          util.embedReply(title, message, msg, spriteUrl);
          db.set("lastExplore", Date.now());
        });
      });
    });
  }

  // Reveals pokemon
  if (command === "reveal") {
    db.get("pokemon").then((pokemon) => {
      // If no pokemon is set
      if (pokemon === "") {
        console.log("Admin requested reveal, but no pokemon is currently set.");

        // Message
        title = "There is no pokemon to reveal";
        message =
          "You have to explore to find a pokemon. Type `!explore` to find a new pokemon.";
        util.embedReply(title, message, msg);

        // If pokemon is set
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

        // Message
        title = "Pokemon escaped!";
        message = `As you approached, the pokemon escaped, but you were able to catch a glimpse of ${util.capitalize(pokemon[englishIndex].name)} (${inBrackets}) as it fled.`;
        util.embedReply(title, message, msg);

        db.set("pokemon", ""); // Sets current pokemon to empty string
      }
    });
  }

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

  // Adds score to leaderboard or updates their current score
  if (command.startsWith("addscore ")) {
    // This is different from the issue #17 because else Rythm or MEE6 think they are meant
    leaderBoard.addUser(msg);
  }

  // Removes score from leaderboard
  if (command.startsWith("removescore ")) {
    // This is different from the issue #17 because else Rythm or MEE6 think they are meant
    leaderBoard.removeUser(msg);
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

            db.get("artwork").then((artwork) => {
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
              util.embedReply(title, message, msg, artwork);
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
  await interaction.deferReply();
  await interactionCreate(interaction);
});

let interactionCreate = async (interaction) => {
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
          interactionCreate(interaction);
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
        util.embedReply(title, message, interaction, spriteUrl);
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
          util.embedReply(title, message, interaction);
          db.set("pokemon", ""); // Sets current pokemon to empty string
        }
        break;
    }
  } else {
    await interaction.editReply({
      content: "Channel not allowed",
    });
  }
};

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

  // Keeps server alive
  //keepAlive();

  // Logs in with secret TOKEN
  client.login(mySecret);
}
