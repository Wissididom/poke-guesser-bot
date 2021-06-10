/*
LIBRARIES
*/

const Discord = require("discord.js");
const Database = require("@replit/database");
const keepAlive = require("./server");
const pokeFetch = require ("./pokemon");


/*
IMPORTANT VARIABLES
*/

const client = new Discord.Client();
const mySecret = process.env['TOKEN'];
const db = new Database();

/*
KEEP ALL FUNCTIONS IN THIS AREA
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

  // TEMPORARY - for debugging purposes only. Remove or add admin check
  if (command === "which") {
    db.get("pokemon").then(pokemon => {
      msg.channel.send(`Current pokemon is: ${pokemon}`);
    });
  } 

  // Print Leaderboard
  if (command === "leaderboard") {
    showLeaderboardBackup(msg);
  }

  if (command === "leaderboard2") {
    showLeaderboard(msg);
  }

  // TEMP COMMAND to add score to msg.author
  if (command.startsWith("addme")) {
    authorName = msg.author.username;
    addScore(authorName);
  }
  
  // dummyLeaderboard
  if (command === "dummy") {
    dummyLeaderboard();
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
        addScore(msg.author.username);
        // Send message that guess is correct
        msg.channel.send(`${msg.author} correctly guessed ${guess}`);
      }
    });
}

// Create a new leaderboard
function newLeaderboard() {
  console.log('Creating new leaderboard');
}

// Add score to user
function addScore(authorName) {
  console.log(`Adding score to user: ${authorName}`);
  // Check the leaderboard if username already exists
  db.get("leaderboard")
  .then(leaderboard => {
    // Add score if user is in leaderboard, add user to leaderboard if not
    if (authorName in leaderboard) {
      leaderboard[authorName] += 1;
    } else {
      leaderboard[authorName] = 1;
    }
    // Set database with changes
    db.set("leaderboard", leaderboard);
    console.log(leaderboard);
  });
}

function showLeaderboard(msg) {
  db.get("leaderboard")
  .then(leaderboard => {

    // Create items array
    let items = Object.keys(leaderboard).map(function(key) {
      return [key, leaderboard[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    // Create Embed
    const leaderboardEmbed = new Discord.MessageEmbed()
    .setTitle('Pokémaster Leaderboard')
    .setAuthor('Poké-guesser Bot', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription("These are the top Pokémasters in this channel.")
    .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');

    // Add fields to Embed
    for (let i = 0; i < items.length; i++) {
      console.log(`${items[i][0]}: ${items[i][1]}`)
      // Outputs the Champion text, first place, and Elite Four text
      if (i == 0) {
        leaderboardEmbed.addFields(
          {name: '---------- CHAMPION ----------', value: 'All hail:'},
          {name: `${i+1}. ${items[i][0]}`, value: `${items[i][1]} pokémon caught.`},
          {name: '--------- ELITE FOUR ---------', value: 'The next runnerups are:'}
        )
      // Populates the elite four
      } else if (i > 0 && i < 5) {
        leaderboardEmbed.addField(`${i+1}. ${items[i][0]}`, `${items[i][1]} pokémon caught.`)
      } 
    }

    if (items.length > 5) {
      console.log('There are more than 5 players.')

    }

    msg.channel.send(leaderboardEmbed);

  })
}

// Todo: Delete this once no longer needed
function showLeaderboardBackup(msg) {
  db.get("leaderboard")
  .then(leaderboard => {
    console.log(leaderboard);
    // Get an array of usernames
    let usernames = Object.keys(leaderboard);
    // Get the longest username in the array
    let longestUsername = usernames.sort((a, b) => {
      return b.length - a.length;
    })[0];
    let longestUserLength = longestUsername.length;
    // Create table headers
    let table = 'POSITION | USER ' + ''.padEnd(longestUserLength - 'USER '.length, ' ') + ' | SCORE\n';
    // Populate table with usernames/scores
    for (let i = 0; i < usernames.length; i++) {
      table += ((i + 1) + '').padEnd('Position '.length, ' ') + '| ' + usernames[i].padEnd(longestUserLength, ' ') + ' | ' + leaderboard[usernames[i]] + '\n';
    }
    // Output table to channel
    msg.channel.send(
      {embed: {
        color: 3447003,
        title: 'This month\'s leaderboard',
        description: "```" + table + "```"
      }});
  });
}

// TEMPORARY
function dummyLeaderboard() {
  const leaderboard = {
    "Super_poke_fan#1": 4,
    "AshKetchup": 2,
    "Pika-choo-choo": 8,
    "hunter2": 8, 
    "bobbyWeerdo": 2,
    "rebecca_bb": 5,
    "samantha": 1,
    "victor-apple": 2,
    "treeHugger69": 3,
    "wasn't-me": 1,
    "#1-Pokemaster": 2,
  };
  
  db.set("leaderboard", leaderboard);
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
