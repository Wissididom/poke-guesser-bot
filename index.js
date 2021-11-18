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

/*
BOT ON

This section runs when the bot is logged in and listening for commands. First, it writes a log to the console indicating it is logged in. Next, it listens on the server and determines whether a message starts with ! or $ before calling either the Admin checkCommand function, or the User checkInput function.
*/

// Outputs console log when bot is logged in
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);  // Logging
});

client.on("interactionCreate", interaction => {
	if (interaction.isCommand()) {
		switch (interaction.commandName) {
			case 'help':
				Commands.help(interaction);
				break;
			case 'settings':
				Commands.settings(interaction);
				break;
			case 'catch':
				Commands._catch(interaction);
				break;
			case 'leaderboard':
				Commands.leaderboard(interaction);
				break;
			case 'score':
				Commands.score(interaction);
				break;
			case 'explore':
				Commands.explore(interaction);
				break;
			case 'reveal':
				Commands.reveal(interaction);
				break;
			case 'mod':
				Commands.mod(interaction);
				break;
		}
	}
	/*console.log('interactionCreate:' + JSON.stringify(interaction, (key, value) => {
		return typeof value === 'bigint' ? value.toString() : value;
	}));*/
});

/*
BOT START CODE (login, start server, etc)

This section checks if there is a TOKEN secret and uses it to login if it is found. If not, the bot outputs a log to the console and terminates.
*/

if (!mySecret) {

  console.log("TOKEN not found! You must setup the Discord TOKEN as per the README file before running this bot.");

  process.kill(process.pid, 'SIGTERM');  // Kill Bot

} else {

  // Check database on start (prevents null errors)
  //util.checkDatabase();

  // Keeps server alive
  //keepAlive();

  // Logs in with secret TOKEN
  client.login(mySecret);

}
