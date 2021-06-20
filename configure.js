const Discord = require("discord.js");
const Database = require("@replit/database");

/*
Configuration

{
  'configured': (bool),
  'channels': [list of channels],
  'roles': [admin roles],
}
*/

const db = new Database();

function configureBot(msg) {
  // Asks user to configure the bot
  msg.channel.send("Please configure the bot as it has not been configured yet.")

  // Asks user to select which roles can administrate bot

  // Asks user which channels bot works in
}

function showConfig(msg) {
  db.get("configuration").then(value => {console.log(value)});
}

function resetConfig(msg) {
  // Resets the bot configuration
  const configuration = {
    'configured': false,
    'roles': []
  };
  db.set("configuration", configuration);
}

function addRole(role) {
  db.get("configuration").then(configuration => {
    configuration["roles"].push(channel);  // Adds channel to list of channels
    db.set("configuration", configuration)
  })
}

module.exports.configureBot = configureBot;
module.exports.showConfig = showConfig;
module.exports.resetConfig = resetConfig;
