/*
LIBRARIES
*/

const Discord = require("discord.js");
const Database = require("@replit/database");

/*
IMPORTED FUNCTIONS
*/
const keepAlive = require("./server");
const pokeFetch = require("./pokemon");
const leaderBoard = require("./leaderboard");


/*
IMPORTANT VARIABLES
*/

const client = new Discord.Client();
const mySecret = process.env['TOKEN'];
const db = new Database();

/*
FUNCTIONS
*/

// Checks if a command is valid
function checkCommand(command, msg) {
  // Command logic goes here

  // Check if command is ping, reply with bot status
  if (command === "ping") {
    msg.reply("Beep-boop! Poke-guesser-bot is running!");
  }

  // Generate new pokemon
  if (command === "generate") {
    console.log("Generating a new pokemon.");
    // Returns pokemon json object
    pokeFetch.generatePokemon().then(pokemon => {
      db.set("pokemon", pokemon.name);
      console.log(pokemon);
      pokeFetch.fetchSprite(pokemon.url).then(sprite => {
        console.log(sprite);
        msg.channel.send("Today's pokemon is:", {files: [sprite]});
      });
    });
  }

  // Output the leaderboard
  if (command === "leaderboard") {
    leaderBoard.showLeaderboard(msg);
  }

  // TEMPORARY - for debugging purposes only. Remove or add admin check
  if (command === "which") {
    db.get("pokemon").then(pokemon => {
      msg.channel.send(`Current pokemon is: ${pokemon}`);
    });
  }

  // TEMP COMMAND to add score to msg.author
  if (command.startsWith("addme")) {
    authorName = msg.author.username;
    leaderBoard.addScore(authorName);
  }
  
  // dummyLeaderboard
  if (command === "dummy") {
    leaderBoard.dummyLeaderboard();
  }

}

// Checks pokemon guess
function checkGuess(guess, msg) {
  
  console.log(`${msg.author} guessed ${guess}.`);

  // Checks if the guess is part of the pokemon name
  db.get("pokemon")
    // Pokemon name might include type (ex: darumaka-galar) so name is split into array
    .then(pokemon => {
      return pokemon.split('-');
    })
    // Check if guess matches first element of the array 
    .then(pokemonArray => {
      if (pokemonArray[0] === guess) {
        leaderBoard.addScore(msg.author.username);
        // Send message that guess is correct
        msg.channel.send(`${msg.author} correctly guessed ${guess}`);
      }
    });
}

/*
BOT/CONSOLE INTERACTIONS (logging)
*/

// Outputs console log when bot is logged in
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
})


/*
BOT MESSAGE LISTENER
*/

// Reads user messages and checks for commands / guesses
client.on("message", msg => {

  // Returns if message is from bot
  if (msg.author.bot) return;

  // Check if user message starts with ! indicating command, call checkCommand
  if (msg.content.startsWith("!")) {
    command = msg.content.split("!")[1];
    checkCommand(command, msg);
  }

  // Check if user message starts with $ indicating guess, call checkGuess
  if (msg.content.startsWith("$catch ")) {
    guess = msg.content.split("$catch ")[1];
    checkGuess(guess, msg);
  }

});

/*
BOT START CODE (login, start server, etc)
*/

// Keeps server alive
// keepAlive()

// Logs in with secret TOKEN
client.login(mySecret);
