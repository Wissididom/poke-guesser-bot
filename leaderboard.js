const Discord = require("discord.js");
const Database = require("@replit/database");

const util = require("./util");
const db = new Database();

/*
LEADERBOARD

The leaderboard is a dictionary stored in the replit database under the "leaderboard" key. 

leaderboard = {
  "user1.id": score, 
  "user2.id": score
}

Each row represents a user. The key is the id of the user in discord, and the value is the user's score
*/

// Add score to user
function addScore(msg) {

  // Get userId from msg
  userId = msg.author.id;
  console.log(`leaderboard.addScore received userId: ${userId}`)
  console.log(`Adding score to user: ${findUser(msg, userId).username}`);

  // Check the leaderboard if id already exists
  db.get("leaderboard")
  .then(leaderboard => {
    // Add score if user is in leaderboard, add user to leaderboard if not
    if (userId in leaderboard) {
      leaderboard[userId] += 1;
    } else {
      leaderboard[userId] = 1;
    }
    // Set database with changes
    db.set("leaderboard", leaderboard);
  })
}

// DEBUGGING - Add score to fake user
function debugFakeScore(msg) {

  // Add a fake user to the leaderboard
  db.get("leaderboard")
  .then(leaderboard => {

    console.log("Adding fake score.");

    leaderboard["12345"] = 1;

    // Set database with changes
    db.set("leaderboard", leaderboard);
  })
}

// Sanitizes leaderboard by removing non-existent users which might break other functions
function sanitizeLeaderboard(msg, leaderboard) {
  // Returns a promise
  return new Promise(function(resolve, reject) {
    // Iterate through leaderboard object
    for (const [userId, score] of Object.entries(leaderboard)) {
      // Retrieve user from guild
      userObj = findUser(msg, userId);
      // If user object is null, delete the key from leaderboard
      if (userObj === null) {
        console.log(`Removing User ID ${userId} from leaderboard.`)
        delete leaderboard[userId];
      }
      // Resolves promise and returns leaderboard once fake users removed
      resolve(leaderboard);
    }
  });
}

function generateLeaderboard() {
  let leaderboard = {}
  for (i=0; i<20; i++) {
    let userName = `user${i+1}`;
    let score = Math.floor(Math.random() * 10);
    leaderboard[userName] = score;
  }
  return leaderboard;
}

// Shows Leaderboard by creating a new Embed
function showLeaderboard(msg, debug=false) {

  // Retrieve leaderboard from database
  db.get("leaderboard")
  .then(leaderboard => {

    console.log(leaderboard);

    // Checks if debugging has been passed
    if (!debug) {
      sanitizedLeaderboard = sanitizeLeaderboard(msg, leaderboard);
    } else {
      // Generates debug leaderboard
      sanitizedLeaderboard = generateLeaderboard();
    }

    return sanitizedLeaderboard;
  })
  .then(sanitizedLeaderboard => {

    console.log(sanitizedLeaderboard);

    // Variables for use in loops
    let table = '';
    let longestUserLength = '';
    let userName = '';
    let score = '';

    // Create items array
    let items = Object.keys(sanitizedLeaderboard).map(function(key) {
      return [key, sanitizedLeaderboard[key]];
    });

    // Sort the array based on the score (second element)
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    // Create Embed
    const leaderboardEmbed = new Discord.MessageEmbed()
    .setTitle('Pokémaster Leaderboard')
    .setAuthor('POKé-GUESSER BOT', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription("Top 20 Pokémasters in this channel.")
    .setThumbnail('https://raw.githubusercontent.com/GeorgeCiesinski/poke-guesser-bot/master/images/pokemon-trophy.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png');

    // Add fields to Embed
    for (let i = 0; i < Math.max(5, items.length); i++) {

      // If iteration number is less than or equal to length of array
      if (i < Math.max(0, items.length)) {
        if (!debug) {
          // Set username & score from data in item
          userName = findUser(msg, items[i][0]).username;
        } else {
          // Debug username
          userName = items[i][0];
        }
        score = items[i][1];
        // Output item in array to console if exists
        console.log(`${userName}: ${score}`);
      }
      
      // If on the first element, and element exists, create champion
      if (i == 0 && i < items.length) {
        leaderboardEmbed.addFields(
          {name: '---------- CHAMPION ----------', value: 'All hail:'},
          {name: `🏆 ${i+1}. ${userName}`, value: `${score} pokémon caught.`},
          {name: '--------- ELITE FOUR ---------', value: 'The next runnerups are:'}
        ) 
      // If on the first element but element is empty, create TBA
      } else if (i == 0 && i == items.length) {
        leaderboardEmbed.addFields(
          {name: '---------- CHAMPION ----------', value: 'All hail:'},
          {name: `${i+1}. TBA`, value: 'Position not claimed'},
          {name: '--------- ELITE FOUR ---------', value: 'The next runnerups are:'}
        )
      }
      
      // If on element 1-4, and element exists, create new elite four member
      if (i > 0 && i < 5 && i < items.length) {
        leaderboardEmbed.addField(`🏅 ${i+1}. ${userName}`, `${score} pokémon caught.`);
      // If on element 1-4 but element is empty, create TBA
      }  else if (i > 0 && i < 5 && i >= items.length) {
        leaderboardEmbed.addField(`${i+1}. TBA`, 'Position not claimed');
      }

      // Creates table header for overflow leaderboard
      if (i==5) {
        // Creates an array of usernames in items starting from index 5
        if (!debug) {
          usernames = Array.from(items.slice(5), x => findUser(msg, x[0]));
        } else {
          usernames = Array.from(items.slice(5), x => x[0]);
        }
        // Get the longest username in the array
        const longestUsername = usernames.sort((a, b) => {
          return b.length - a.length;
        })[0];
        longestUserLength = longestUsername.length;
        table = 'PLACE | USER ' + ''.padEnd(longestUserLength - 'USER '.length, ' ') + ' | POKEMON\n';
      }

      // Adds additional users into overflow leaderboard up until 20
      if (i >= 5 && i < 20) {
        table += ((i + 1) + '').padEnd('Place '.length, ' ') + '| ' + userName.padEnd(longestUserLength, ' ') + ' | ' + score + '\n';
      }

    }

    if (items.length > 5) {
      leaderboardEmbed.addField('--------- REGION RUNNERUPS ---------', "```" + table + "```")
    }
  
  // Sends the completed Embed
  msg.channel.send(leaderboardEmbed);

  // Update leaderboard with sanitized leaderboard
  db.set("leaderboard", sanitizedLeaderboard);

  });
}

// Shows User Position
function position(msg) {

  db.get("leaderboard")
  .then(leaderboard => {

    // Create items array
    let items = Object.keys(leaderboard).map(function(key) {
      return [key, leaderboard[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    // Create new array with just names
    const userNames = Array.from(items, user => user[0]);

    const firstMention = msg.mentions.users.first();
    if (firstMention) { // !== undefined && !== null
      // Find position of mentioned user
      const userPosition = userNames.indexOf(firstMention.username) + 1;
      replyPosition(msg, firstMention.username, userPosition, true);
    } else {
      // Find position of message author
      const userPosition = userNames.indexOf(msg.author.username) + 1;
      replyPosition(msg, msg.author.username, userPosition, false);
    }
  })
}

function replyPosition(msg, userName, userPosition, mention) {
  if (userPosition === 0) {
    console.log(`${userName} is not on the leaderboard.`);
    if (mention) {
      msg.reply(`${userName} is currently not on the leaderboard. ${userName} must guess at least one pokemon first!`);
    } else {
      msg.reply("You are currently not on the leaderboard. You must guess at least one pokemon first!");
    }
  } else {
    console.log(`${userName}'s position: ${userPosition}`);
    if (mention) {
      msg.reply(`${userName}'s current position is: ${userPosition}`);
    } else {
      msg.reply(`Your current position is: ${userPosition}`);
    }
  }
}

// Formally resets leaderboard and announces the end of the championship
function newChampionship(msg) {

  // Output message that the championship has ended and x is the victor
  db.get("leaderboard")
  .then(leaderboard => {

    // Output leaderboard
    showLeaderboard(msg);

    // Create items array
    let items = Object.keys(leaderboard).map(function(key) {
      return [key, leaderboard[key]];
    })

    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    })

    const winner = findUser(msg, items[0][0]);  // Determine winner of championship
    const finalScore = items[0][1];  // Determine winner's final score
    var delayInMilliseconds = 500;  // 0.5 seconds

    // Output Championship Victor with delay to allow leaderboard to send first
    setTimeout(function() {
      const title = "Champion Decided!";
      const message = `As the Championship draws to a close, the victor stands out from the rest of the competitors!
      
      ${winner}
      
      has been declared the top Pokémon Master in the region for catching a grand total of 
      
      ${finalScore} Pokémon 
      
      and is presented with the Pokémon Championship trophy in front of thousands of screaming fans.
      
      The championship begins anew!`;
      const image = "https://raw.githubusercontent.com/GeorgeCiesinski/poke-guesser-bot/master/images/pokemon-trophy.png"
      util.embedReply(title, message, msg, image);

      // Erase leaderboard
      emptyLeaderboard(msg);
    }, delayInMilliseconds);
  })
}

// Empties leaderboard
function emptyLeaderboard(msg) {
  
  const leaderboard = {};
  db.set("leaderboard", leaderboard);
  console.log('Emptied leaderboard.');

}

// Finds the GuildMember by User-ID
function findMember(message, id) {
  // Return member or undefined if not found
  return message.guild.members.cache.get(id);
}

// Finds the User by User-ID
function findUser(message, id) {
  member = findMember(message, id);
  // If member found, return member, else return null
  if (member) {
    return member.user;
    console.log(`User ID ${id} found in guild.`)
  } else {
    console.log(`WARNING: User ID ${id} not found in guild.`)
    return null
  }
}

// Exports each function separately
module.exports.addScore = addScore;
module.exports.showLeaderboard = showLeaderboard;
module.exports.position = position;
module.exports.newChampionship = newChampionship;
module.exports.emptyLeaderboard = emptyLeaderboard;
// Debugging, remove
module.exports.findUser = findUser;
module.exports.debugFakeScore = debugFakeScore;