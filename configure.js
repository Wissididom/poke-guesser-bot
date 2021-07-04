const Discord = require("discord.js");
const Database = require("@replit/database");

const db = new Database();

/*
UTILITIES
*/

// Wraps reply in poke-guesser themed embed
function embedReply(title, message, msg) {

  // Creates new embedded message
  const embed = new Discord.MessageEmbed()
    .setTitle(title)  // Adds title
    .setAuthor('POKé-GUESSER BOT', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription(message)  // Adds message
    .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');

  msg.channel.send(embed);  // Sends the embedded message back to channel

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

    // Parse Json into javascript object
    configJson = JSON.parse(configuration);

    // Extract roles and channels from array
    const roles = configJson.configuration.roles;
    const channels = configJson.configuration.channels;

    // Debug
    console.log(roles);
    console.log(channels);

    // Format roles names and id for easy viewing
    let roleText = ""
    for (let i = 0; i < roles.length; i++) {
      let currentRole = roles[i];  // Parse string into an object
      roleText += currentRole.name + " (ID: " + currentRole.id + ")\n";  // Create a new role line
    }

    // Format channel names and id for easy viewing
    let channelText = ""
    for (let i = 0; i < channels.length; i++) {
      let currentChannel = channels[i];  // Parse string into an object
      channelText += currentChannel.name + " (ID: " + currentChannel.id + ")\n";  // Create a channel line
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
    "configuration": {
      "channels": [],
      "roles": []
    }
  };

  db.set("configuration", JSON.stringify(configuration));

}

/*
ROLES
*/

// Outputs server roles (name & id)
function roles(msg) {

  let availableRoles = "";
  msg.guild.roles.cache.each(role => availableRoles += role.name + " - " + role.id + "\n");
  embedReply("Available Roles", availableRoles, msg);

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

// Adds role to bot moderator roles
function addRole(role, msg) {

  // If role exists, try adding to config
  if (roleExists(role, msg)) { 

    // Role exists
    console.log("Role exists. Adding to database.");

    // Get the configuration from the database
    db.get("configuration").then(configuration => {

      const roleObject = getRole(role, msg);  // Get role object

      // Parse Json into javascript object
      configJson = JSON.parse(configuration);

      // Add role if doesn't exist in configuration
      // Check if role is in configuration
      if (configJson.configuration.roles.some(roleItem => roleItem.id == roleObject.id)) {
        console.log("Role is already in configuration");
        embedReply("ERROR: Role already added!", `The role >${role}< is already included in the configuration.
        
        Type '!show config' to see the current configuration.`, msg);
      } else {
        var newRole = {
        "name": roleObject.name, 
        "id": roleObject.id
        };  // Create new role array

        configJson.configuration.roles.push(newRole);  // Adds role to list of roles

        db.set("configuration", JSON.stringify(configJson));  // Sets the updated list into database

        // Outputs confirmation that role was added to server
        embedReply("New Role Added", `The role has been added sucessfully: 
        
        ${roleObject.name} (ID: ${roleObject.id})

        Type '!show config' to see the configuration.`, msg);
      }

    })

  } else {

    console.log("Role doesn't exists.");

    embedReply("ERROR: Failed to add role!", `The role >${role}< does not exist and could not be added.
    Type '!roles' to see the available roles.`, msg);

  }
}

function removeRole(role) {
  // Check if the role is in the database

  // Remove Role
  // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array

  // Send a message
}

// Outputs server channels (name & id)
function channels(msg) {

  let availableChannels = "";
  msg.guild.channels.cache.each(channel => availableChannels += channel.name + " - " + channel.id + "\n");
  embedReply("Available Channels", availableChannels, msg);

}

// Check if channel exists, return true or false
function channelExists(channelName, msg) {
  // Code
}

function getChannel(channelName, msg) {
  // Code
}

function addChannel(channel) {
  // 1. Check if the channel exists first

  // 2. If channel exists, add to config

  // 3. Send a message
}

function removeChannel(channel) {
  // 1. Check if the channel is in the database

  // 2. If channel exists, remove

  // 3. Send a message
}

// Function Exports
module.exports.configureBot = configureBot;
module.exports.showConfig = showConfig;
module.exports.resetConfig = resetConfig;
module.exports.roles = roles;
module.exports.channels = channels;
module.exports.roleExists = roleExists;
module.exports.addRole = addRole;
