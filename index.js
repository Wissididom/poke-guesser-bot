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
const mySecret = process.env['TOKEN2']
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

  if (command === "leaderboard") {
    showLeaderboard()
  }

  if (command.startsWith("addscore-")) {
    username = command.split('-')[1]
    console.log(`Inputted username is ${username}`)
    addScore(username)
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
function addScore(username) {
  console.log('Adding score to user')
  // Check the leaderboard if username already exists
  db.get("leaderboard")
  .then(leaderboard => {
    console.log(leaderboard)
    console.log(leaderboard[username])
    // If user doesn't exist, add user & score
    // Elif user does exist, update score
  })
}

function showLeaderboard() {
  db.get("leaderboard")
  .then(leaderboard => {
    console.log(leaderboard)
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
