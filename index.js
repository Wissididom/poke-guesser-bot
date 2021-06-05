/*
LIBRARIES
*/

const Discord = require("discord.js")
const Database = require("@replit/database")
const keepAlive = require("./server")
const fetch = require('node-fetch');


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
  if (guess.startsWith("catch ")) {
    pokemon_guess = guess.split("catch ")[1]
  }

  // String with variable
  msg.reply(`User guessed ${pokemon_guess}`)
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
  })
  
  // If user doesn't exist, add user & score
  // Elif user does exist, update score
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

  // Check if user message starts with # indicating guess, call checkGuess
  if (msg.content.startsWith("$")) {
    guess = msg.content.split("$")[1]
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
