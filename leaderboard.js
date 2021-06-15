const Discord = require("discord.js");
const Database = require("@replit/database");

const db = new Database();

// Pending function transfer// Create a new leaderboard
function newLeaderboard() {
  console.log('Creating new leaderboard');
}

// Add score to user
function addScore(authorName) {
  console.log(`Adding score to user: ${authorName}`);
  // Check the leaderboard if username already exists
  db.get("leaderboard")
  .then(leaderboard => {
    // Add score if user is in leaderboard, add user to leaderboard if not
    if (authorName in leaderboard) {
      leaderboard[authorName] += 1;
    } else {
      leaderboard[authorName] = 1;
    }
    // Set database with changes
    db.set("leaderboard", leaderboard);
    console.log(leaderboard);
  });
}

/*
Todo: 
1. Leaderboard should be functional if empty, and if missing members
2. Add field with raw leaderboard for overflowing (more than 5) members on the leaderboard
3. Transfer to another file
*/
function showLeaderboard(msg) {
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

    // Create Embed
    const leaderboardEmbed = new Discord.MessageEmbed()
    .setTitle('Pokémaster Leaderboard')
    .setAuthor('Poké-guesser Bot', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription("These are the top Pokémasters in this channel.")
    .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');

    // Add fields to Embed
    for (let i = 0; i < items.length; i++) {
      console.log(`${items[i][0]}: ${items[i][1]}`)
      // Creates the Champion text, adds first place, and Elite Four text
      if (i == 0) {
        leaderboardEmbed.addFields(
          {name: '---------- CHAMPION ----------', value: 'All hail:'},
          {name: `${i+1}. ${items[i][0]}`, value: `${items[i][1]} pokémon caught.`},
          {name: '--------- ELITE FOUR ---------', value: 'The next runnerups are:'}
        )
      // Adds the elite four
      } else if (i > 0 && i < 5) {
        // Adds new elite four member
        leaderboardEmbed.addField(`${i+1}. ${items[i][0]}`, `${items[i][1]} pokémon caught.`)
      } 
    }

    // Sends the completed Embed
    msg.channel.send(leaderboardEmbed);

  })
}

// Todo: Delete this once no longer needed
function showLeaderboardBackup(msg) {
  db.get("leaderboard")
  .then(leaderboard => {
    console.log(leaderboard);
    // Get an array of usernames
    let usernames = Object.keys(leaderboard);
    // Get the longest username in the array
    let longestUsername = usernames.sort((a, b) => {
      return b.length - a.length;
    })[0];
    let longestUserLength = longestUsername.length;
    // Create table headers
    let table = 'POSITION | USER ' + ''.padEnd(longestUserLength - 'USER '.length, ' ') + ' | SCORE\n';
    // Populate table with usernames/scores
    for (let i = 0; i < usernames.length; i++) {
      table += ((i + 1) + '').padEnd('Position '.length, ' ') + '| ' + usernames[i].padEnd(longestUserLength, ' ') + ' | ' + leaderboard[usernames[i]] + '\n';
    }
    // Output table to channel
    msg.channel.send(
      {embed: {
        color: 3447003,
        title: 'This month\'s leaderboard',
        description: "```" + table + "```"
      }});
  });
}

// TEMPORARY
function dummyLeaderboard() {
  const leaderboard = {};
  /*
  "Super_poke_fan#1": 4,
  "AshKetchup": 2,
  "Pika-choo-choo": 8,
  "hunter2": 8, 
  "bobbyWeerdo": 2,
  "rebecca_bb": 5,
  "samantha": 1,
  "victor-apple": 2,
  "treeHugger69": 3,
  "wasn't-me": 1,
  "#1-Pokemaster": 2,
  */
  
  db.set("leaderboard", leaderboard);
  console.log('Generated dummy leaderboard.')
}

// Exports each function separately
module.exports.addScore = addScore;
module.exports.showLeaderboard = showLeaderboard;
module.exports.dummyLeaderboard = dummyLeaderboard;