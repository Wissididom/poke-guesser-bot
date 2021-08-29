/*
LIBRARIES
*/

const Discord = require("discord.js");
const Database = require("@replit/database");

/*
IMPORTED FUNCTIONS
*/
const keepAlive = require("./server");
const util = require("./util");
const pokeFetch = require("./pokemon");
const leaderBoard = require("./leaderboard");
const configure = require("./configure");

/*
OBJECTS, TOKENS, GLOBAL VARIABLES
*/

const client = new Discord.Client();  // Discord Object
const db = new Database();  // Replit Database

const mySecret = process.env['TOKEN'];  // Discord Token

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
    configure.showConfig(msg)
  }

  // Resets configuration to default settings
  if (command === "reset config") {
    configure.resetConfig(msg)
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
    pokeFetch.generatePokemon().then(pokemon => {
      let pokemonNames = [pokemon.name.split('-')[0].toLowerCase()];
      pokeFetch.fetchNames(pokemonNames[0]).then(names => {
        for (let name of names) {
          pokemonNames.push(name); // available properties: name, languageName and languageUrl
        }
        db.set("pokemon", pokemonNames); // Sets current pokemon (different languages) names in database
      });
      // Gets sprite url, and replies to the channel with newly generated pokemon
      pokeFetch.fetchSprite(pokemon.url).then(sprites => {
        // Extract sprite and official artwork
        const spriteUrl = sprites.front_default;
        if (!spriteUrl) {
          console.log(`Redoing the explore because i got a ${pokemon.name} without a front sprite`);
          checkCommand(command, msg);
          return;
        }
        const officialArtUrl = sprites.other['official-artwork'].front_default;
        console.log(spriteUrl);
        console.log(officialArtUrl);
        // Set official artwork url in database
        db.set("artwork", officialArtUrl); // Sets official art url in database
        const title = "A wild POKEMON appeared!";
        const message = "Type `$catch _____` with the correct pokemon name to catch this pokemon!"
        util.embedReply(title, message, msg, spriteUrl)
      });
    });
  }

  // Reveals pokemon
  if (command === "reveal") {
    db.get("pokemon").then(pokemon => {

      // If no pokemon is set
      if (pokemon === "") {

        console.log("Admin requested reveal, but no pokemon is currently set.")

        // Message
        title = "There is no pokemon to reveal";
        message = "You have to explore to find a pokemon. Type \`!explore\` to find a new pokemon.";
        util.embedReply(title, message, msg);

      // If pokemon is set
      } else {
        let pokemonNames = [pokemon[0]];
        for (let i = 1; i < pokemon.length; i++) {
          let lowercaseName = pokemon[i].name.toLowerCase();
          if (!pokemonNames.includes(lowercaseName))
            pokemonNames.push(lowercaseName.toLowerCase());
        }

        let inBrackets = '';
        for (let i = 1; i < pokemonNames.length; i++) {
          if (inBrackets == '')
            inBrackets = util.capitalize(pokemonNames[i]);
          else
            inBrackets += ', ' + util.capitalize(pokemonNames[i]);
        }
        console.log(`Admin requested reveal: ${pokemon[0]} (${inBrackets})`);

        // Message
        title = "Pokemon escaped!";
        message = `As you approached, the pokemon escaped, but you were able to catch a glimpse of ${util.capitalize(pokemon[0])} (${inBrackets}) as it fled.`;
        util.embedReply(title, message, msg);

        db.set("pokemon", "");  // Sets current pokemon to empty string
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
  if (command.startsWith("addscore ")) { // This is different from the issue #17 because else Rythm or MEE6 think they are meant
    leaderBoard.addUser(msg);
  }

  // Removes score from leaderboard
  if (command.startsWith("removescore ")) { // This is different from the issue #17 because else Rythm or MEE6 think they are meant
    leaderBoard.removeUser(msg);
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

    guessEntered = true;  // Lock catch until complete

    guess = msg.content.split("catch ")[1];  // Splits at the command, gets pokemon name guess
    console.log(`${msg.author} guessed ${guess}.`);

    // Checks if the guess is part of the pokemon name
    db.get("pokemon").then(pokemon => {
      // If no pokemon set 
      if (pokemon === "") {
        console.log("No pokemon set.");

        guessEntered = false;  // Reset guessEntered

        return;
      }
      // Loop through pokemon names and check against guess
      for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i].name ? pokemon[i].name.toLowerCase() === guess.toLowerCase() : pokemon[i].toLowerCase() === guess.toLowerCase()) {

          db.set("pokemon", ""); // Sets current pokemon to empty string

          db.get("artwork").then(artwork => {
            // Send msg to addScore - id will be extrapolated
            leaderBoard.addScore(msg);
            // Send message that guess is correct
            if ((pokemon[i].name ? pokemon[i].name : pokemon[i]).toLowerCase() === pokemon[0].toLowerCase())
              title = `${util.capitalize(pokemon[0])} has been caught!`;
            else
              title = `${util.capitalize(pokemon[0])} (${util.capitalize(pokemon[i].name ? pokemon[i].name : pokemon[i])}) has been caught!`;
            message = `1 point added to ${msg.author}'s score.'
            
            \`$position\`: see your current position
            \`$leaderboard\`: see the updated leaderboard`;
            util.embedReply(title, message, msg, artwork);
          });
          
          guessEntered = false;  // Reset guessEntered
          break; // To avoid scoring multiple times
        }
      }
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
client.on("ready", () => {

  console.log(`Logged in as ${client.user.tag}!`);  // Logging

})

// Reads user messages, interprets commands & guesses, and authenticates channels/roles
client.on("message", msg => {

  // Returns if message is from bot
  if (msg.author.bot) return;

  // Authenticate if bot is allowed to reply on this channel
  configure.authenticateChannel(msg).then(authorized => {

    // Returns if channel is not in config
    if (authorized === false) return;

    // Check if user message starts with ! indicating command, call checkCommand
    if (msg.content.startsWith("!")) {
      
      // Authenticate if user is authorized
      configure.authenticateRole(msg).then(authorized => {
        if (authorized) {
          command = msg.content.split("!")[1];
          checkCommand(command, msg);
        }
      })
      
    }

    // Check if user message starts with $ indicating guess, call checkGuess
    if (msg.content.startsWith("$")) {
      inputRequest = msg.content.split("$")[1];
      checkInput(inputRequest, msg);
    }

  })
})

/*
BOT START CODE (login, start server, etc)

This section checks if there is a TOKEN secret and uses it to login if it is found. If not, the bot outputs a log to the console and terminates.
*/

if (mySecret === undefined) {

  console.log("TOKEN not found! You must setup the Discord TOKEN as per the README file before running this bot.");

  process.kill(process.pid, 'SIGTERM');  // Kill Bot

} else {

  // Check database on start (prevents null errors)
  util.checkDatabase();

  // Keeps server alive
  keepAlive();

  // Logs in with secret TOKEN
  client.login(mySecret);

}
