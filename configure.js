const Discord = require("discord.js");
const Database = require("@replit/database");

const db = new Database();

// Wraps reply in poke-guesser themed embed
function embedReply(title, message, msg) {

  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setAuthor('POKé-GUESSER BOT', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription(message)
    .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');

  msg.channel.send(embed);  

}

// Shows configuration instructions
function configureBot(msg) {

  msg.channel.send("Please configure the bot as it has not been configured yet.")

  // Asks user to select which roles can administrate bot

  // Asks user which channels bot works in
}

// Sends a message to the channel with the server configuration.
function showConfig(msg) {
  
  db.get("configuration")
  .then(configuration => {

    // Console Logging
    console.log("Showing configuration.")
    console.log(configuration);

    // Extract roles and channels from array
    const roles = configuration["roles"]
    const channels = configuration["channels"]

    // Format roles names and id for easy viewing
    let roleText = ""
    for (let i = 0; i < roles.length; i++) {
      let currentRole = JSON.parse(roles[i]);  // Parse string into an object
      roleText += currentRole.name + " - " + currentRole.id + "\n";  // Create a new line: role.name - role.id
    }

    // Format channel names and id for easy viewing
    let channelText = ""
    for (let i = 0; i < channels.length; i++) {
      let currentChannel = JSON.parse(channels[i]);  // Parse string into an object
      roleText += currentChannel.name + " - " + currentChannel.id + "\n";  // Create a new line: channel.name - channel.id
    }

    // Creates message template literal
    const message = `ROLES: 
    ${roleText}
    CHANNELS: 
    ${channelText}`;

    // Embeds message
    embedReply("Configuration Settings:", message, msg);
  });
}

// Resets the bot configuration
function resetConfig(msg) {

  console.log("Resetting bot configuration.");

  const configuration = {
    'channels': [],
    'roles': []
  };

  db.set("configuration", configuration);

  showConfig(msg);

}

// Adds role to bot moderator roles
function addRole(role, msg) {

  // If role exists, add to config
  if (roleExists(role, msg)) { 

    // Role exists
    console.log("Role exists. Adding to database.");

    // Get the configuration from the database
    db.get("configuration").then(configuration => {

      const roleObject = getRole(role, msg);  // Get role object

      var newRole = {
        "name": roleObject.name, 
        "id": roleObject.id
      };  // Create new role array

      configuration["roles"].push(JSON.stringify(newRole));  // Adds role to list of roles

      db.set("configuration", configuration);  // Sets the updated list into database

      showConfig(msg);

    })

  } else {

    console.log("Role doesn't exists.")

    msg.channel.send(`The role >${role}< was not found in the server and could not be added.`);

  }
}

function removeRole(role) {
  // Check if the role is in the database

  // Remove Role
  // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array

  // Send a message
}

// Checks if role exists, returns true or false
function roleExists(roleName, msg) {

  // Todo: Add functionality so that roleName or roleID can be passed to find the role

  console.log(`Checking if role exists: >${roleName}<`);

  return msg.guild.roles.cache.some(role => role.name === roleName);

}

// Gets role from discord server role cache by name
function getRole(roleName, msg) {

  // Todo: Add functionality so that roleName or roleID can be passed to get the role

  return msg.guild.roles.cache.find(role => role.name === roleName);

}

function addChannel(channel) {
  // 1. Check if the channel exists first

  // 2. If channel exists, add to config

  // 3. Send a message
}

function removeChannel(channel) {
  // 1. Check if the channel is in the database

  // 2. If channel exists, add to config

  // 3. Send a message
}

// Check if channel exists, return true or false
function channelExists(channelName, msg) {
  // Code
}

// Outputs server roles (name & id)
function roles(msg) {

  msg.guild.roles.cache.each(role => console.log(role.name, role.id));

}

// Function Exports
module.exports.configureBot = configureBot;
module.exports.showConfig = showConfig;
module.exports.resetConfig = resetConfig;
module.exports.roles = roles;
module.exports.roleExists = roleExists;
module.exports.addRole = addRole;
