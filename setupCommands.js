/*
LIBRARIES
*/

require('dotenv').config();

const { Client, Intents } = require('discord.js');
const Commands = require('./commands.js');

/*
OBJECTS, TOKENS, GLOBAL VARIABLES
*/

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']}); // Discord Object

const mySecret = process.env['TOKEN'];  // Discord Token

// Outputs console log when bot is logged in and registers all commands
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);  // Logging
	const registerObjects = Commands.getRegisterObjects();
	let promises = [];
	promises.push(client.application?.commands?.create(registerObjects['help']));
	promises.push(client.application?.commands?.create(registerObjects['settings']));
	promises.push(client.application?.commands?.create(registerObjects['catch']));
	promises.push(client.application?.commands?.create(registerObjects['leaderboard']));
	promises.push(client.application?.commands?.create(registerObjects['score']));
	promises.push(client.application?.commands?.create(registerObjects['explore']));
	promises.push(client.application?.commands?.create(registerObjects['reveal']));
	promises.push(client.application?.commands?.create(registerObjects['mod']));
	Promise.all(promises).then(reolvedPromises => {
		process.kill(process.pid, 'SIGTERM');
	});
});

/*
BOT START CODE (login, start server, etc)

This section checks if there is a TOKEN secret and uses it to login if it is found. If not, the bot outputs a log to the console and terminates.
*/

if (!mySecret) {
  console.log("TOKEN not found! You must setup the Discord TOKEN as per the README file before running this bot.");
  process.kill(process.pid, 'SIGTERM');  // Kill Bot
} else {
  // Logs in with secret TOKEN
  client.login(mySecret);
}
