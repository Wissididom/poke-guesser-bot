/*
LIBRARIES
*/

const Discord = require("discord.js")
const Database = require("@replit/database")
const keepAlive = require("./server")
const pokeFetch = require ("./pokemon")


/*
IMPORTANT VARIABLES
*/

const client = new Discord.Client()
const mySecret = process.env['TOKEN']
const db = new Database()

/*
KEEP ALL FUNCTIONS IN THIS AREA
*/

// Checks if a command is valid
function checkCommand(command, msg) {
  // Command logic goes here

  // Check if command is ping, reply with bot status
  if (command === "ping") {
    msg.reply("Beep-boop! Poke-guesser-bot is running!")
  }

  // Generate new pokemon
  if (command === "generate") {
    console.log("Generating a new pokemon.")
    // Returns pokemon json object
    pokeFetch.generatePokemon().then(pokemon => {
      db.set("pokemon", pokemon.name)
      console.log(pokemon)
      pokeFetch.fetchSprite(pokemon.url).then(sprite => {
        console.log(sprite)
        msg.channel.send("Today's pokemon is:", {files: [sprite]})
      })
    })
  }

  // TEMPORARY - for debugging purposes only. Remove or add admin check
  if (command === "which") {
    db.get("pokemon").then(pokemon => {
      msg.channel.send(`Current pokemon is: ${pokemon}`)
    })
  }  

  // Print Leaderboard
  if (command === "leaderboard") {
    showLeaderboard(msg)
  }

  // TEMP COMMAND to add score to user
  if (command.startsWith("addscore-")) {
    authorName = command.split('-')[1]
    console.log(`Inputted username is ${authorName}`)
    addScore(authorName)
  }

  // TEMP COMMAND to add score to msg.author
  if (command.startsWith("addme")) {
    authorName = msg.author.username
    addScore(authorName)
  }
  
  // dummyLeaderboard
  if (command === "dummy") {
    dummyLeaderboard()
  }

  //pokemon leaderboard function?? Not sure if this counts as a function

}

// Checks pokemon guess
function checkGuess(guess, msg) {
  
  console.log(`${msg.author} guessed ${guess}.`)

  // Checks if the guess is part of the pokemon name
  db.get("pokemon")
    // Pokemon name might include type (ex: darumaka-galar) so name is split into array
    .then(pokemon => {
      return pokemon.split('-')
    })
    // Check if guess matches first element of the array 
    .then(pokemonArray => {
      if (pokemonArray[0] === guess) {
        addScore(msg.author.username)
        // Send message that guess is correct
        msg.channel.send(`${msg.author} correctly guessed ${guess}`)
      }
    })
}

// Create a new leaderboard
function newLeaderboard() {
  console.log('Creating new leaderboard')
}

// Add score to user
function addScore(authorName) {
  console.log(`Adding score to user: ${authorName}`)
  // Check the leaderboard if username already exists
  db.get("leaderboard")
  .then(leaderboard => {
    // Add score if user is in leaderboard, add user to leaderboard if not
    if (authorName in leaderboard) {
      leaderboard[authorName] += 1
    } else {
      leaderboard[authorName] = 1
    }
    // Set database with changes
    db.set("leaderboard", leaderboard)
    console.log(leaderboard)
  })
}

function showLeaderboard(msg) {
  db.get("leaderboard")
  .then(leaderboard => {
    console.log(leaderboard)
    // Get an array of usernames
    let usernames = Object.keys(leaderboard)
    // Get the longest username in the array
    let longestUsername = usernames.sort((a, b) => {
      return b.length - a.length
    })[0]
    let longestUserLength = longestUsername.length
    // Create table headers
    let table = 'Position | User ' + ''.padEnd(longestUserLength - 'User '.length, ' ') + ' | Score\n'
    // Populate table with usernames/scores
    for (let i = 0; i < usernames.length; i++) {
      table += ((i + 1) + '').padEnd('Position '.length, ' ') + '| ' + usernames[i].padEnd(longestUserLength, ' ') + ' | ' + leaderboard[usernames[i]] + '\n'
    }
    // Output table to channel
    msg.channel.send(
      {embed: {
        color: 3447003,
        fields: [{
          name:
          value:
        }]
        title: 'This month\'s leaderboard',
        description: "```" + table + "```"
      }})
  })
}

// TEMPORARY
function dummyLeaderboard() {
  const leaderboard = {
    "user_1": 4,
    "user_2": 2,
    "user_3": 5,
    "user_7": 8
  }
  
  db.set("leaderboard", leaderboard)
}

/*
BOT/CONSOLE INTERACTIONS (logging)
*/

// Outputs console log when bot is logged in
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})


/*
BOT MESSAGE LISTENER
*/

// Reads user messages and checks for commands / guesses
client.on("message", msg => {

  // Returns if message is from bot
  if (msg.author.bot) return

  // Check if user message starts with ! indicating command, call checkCommand
  if (msg.content.startsWith("!")) {
    command = msg.content.split("!")[1]
    checkCommand(command, msg)
  }

  // Check if user message starts with $ indicating guess, call checkGuess
  if (msg.content.startsWith("$catch ")) {
    guess = msg.content.split("$catch ")[1]
    checkGuess(guess, msg)
  }

})

/*
BOT START CODE (login, start server, etc)
*/

// Keeps server alive
// keepAlive()

// Logs in with secret TOKEN
client.login(mySecret)
