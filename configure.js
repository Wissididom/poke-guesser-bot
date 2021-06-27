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
  // Shows configuration instructions
  msg.channel.send("Please configure the bot as it has not been configured yet.")

  // Asks user to select which roles can administrate bot

  // Asks user which channels bot works in
}

function showConfig(msg) {
  db.get("configuration")
  .then(config => 
    {console.log(config);
    const configured = config["configured"];
    const channels = config["channels"];
    const roles = config["roles"];
    const message = `Configured: ${configured}
Channels: ${channels}
Roles: ${roles}`;
    msg.channel.send(message);
    });
}

function resetConfig(msg) {
  // Resets the bot configuration
  const configuration = {
    'configured': false,
    'channels': [],
    'roles': []
  };
  db.set("configuration", configuration);
}

function addRole(role) {
  // 1. Check if role exists first

  // 2. If exists, add role to config
  db.get("configuration").then(configuration => {
    configuration["roles"].push(channel);  // Adds channel to list of channels
    db.set("configuration", configuration)
  })
}

// Outputs server roles (name & id)
function roles(msg) {
  msg.guild.roles.cache.each(role => console.log(role.name, role.id));
}

// Checks if role exists, returns true or false
function roleExists(roleName, msg) {
  console.log(`Checking if role exists: >${roleName}<`);
  return msg.guild.roles.cache.some(role => role.name === roleName);
}

module.exports.configureBot = configureBot;
module.exports.showConfig = showConfig;
module.exports.resetConfig = resetConfig;
module.exports.roles = roles;
module.exports.roleExists = roleExists;
