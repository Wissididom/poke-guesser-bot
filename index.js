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
OBJECTS AND TOKENS
*/

const client = new Discord.Client();  // Discord Object
const db = new Database();  // Replit Database

const mySecret = process.env['TOKEN'];  // Discord Token

/*
ADMIN AND PLAYER COMMANDS
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
      db.set("pokemon", pokemon.name);  // Sets current pokemon in database
      console.log(pokemon);
      // Gets sprite url, and replies to the channel with newly generated pokemon
      pokeFetch.fetchSprite(pokemon.url).then(spriteUrl => {
        console.log(spriteUrl);
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

        console.log(`Admin requested reveal: ${pokemon}`);

        // Message
        title = "Pokemon escaped!";
        message = `As you approached, the pokemon escaped, but you were able to catch a glimpse of ${util.capitalize(pokemon)} as it fled.`;
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

// Checks pokemon guess
function checkInput(inputRequest, msg) {

  // Player Help
  if (inputRequest === "help") {

    util.playerHelp(msg);

  }

  // Player Guess
  if (inputRequest.startsWith("catch ")) {

    guess = msg.content.split("catch ")[1];  // Splits at the command, gets pokemon name guess
    
    console.log(`${msg.author} guessed ${guess}.`);

    // Checks if the guess is part of the pokemon name
    db.get("pokemon")
      .then(pokemon => {

        // Pokemon name might include type (ex: darumaka-galar) so name is split into array
        return pokemon.split('-');

      })
      // Check if guess matches first element of the array 
      .then(pokemonArray => {
        if (pokemonArray[0] === "") {
          console.log("No pokemon set.");
          return;
        }
        pokeFetch.fetchNames(pokemonArray[0].toLowerCase()).then(names => {
          console.log(`Guess: ${guess}`);
          for (let i = 0; i < names.length; i++) {
            if (names[i].name.toLowerCase() === guess.toLowerCase()) {
              // Send msg to addScore - id will be extrapolated
              leaderBoard.addScore(msg);
              // Send message that guess is correct
              if (pokemonArray[0].toLowerCase() === names[i].name.toLowerCase())
                title = `${util.capitalize(names[i].name)} has been caught!`;
              else
                title = `${util.capitalize(pokemonArray[0])} (${util.capitalize(names[i].name)}) has been caught!`;
              message = `1 point added to ${msg.author}'s score.'
              
              Type \`$position\` to see your current position &
              Type \`$leaderboard\` to see the updated leaderboard!`;
              util.embedReply(title, message, msg);
              db.set("pokemon", ""); // Sets current pokemon to empty string
              break; // To avoid scoring multiple times
            }
          }
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
