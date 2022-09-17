/*
LIBRARIES
*/

require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const Commands = require('./commands.js');

/*
OBJECTS, TOKENS, GLOBAL VARIABLES
*/

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction]}); // Discord Object

const mySecret = process.env['TOKEN'];  // Discord Token

// Outputs console log when bot is logged in and registers all commands
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);  // Logging
	const registerObject = Commands.getRegisterObject();
	let promises = [];
	promises.push(client.application?.commands?.create(registerObject['help']));
	promises.push(client.application?.commands?.create(registerObject['settings']));
	promises.push(client.application?.commands?.create(registerObject['catch']));
	promises.push(client.application?.commands?.create(registerObject['leaderboard']));
	promises.push(client.application?.commands?.create(registerObject['score']));
	promises.push(client.application?.commands?.create(registerObject['explore']));
	promises.push(client.application?.commands?.create(registerObject['reveal']));
	promises.push(client.application?.commands?.create(registerObject['mod']));
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
