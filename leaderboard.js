const Discord = require("discord.js");
const Database = require("@replit/database");

const util = require("./util");
const db = new Database();

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

// Shows Leaderboard by creating a new Embed
function showLeaderboard(msg) {

  db.get("leaderboard")
  .then(leaderboard => {

    // Variables for use in loops
    let table = '';
    let longestUserLength = '';

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
    .setAuthor('POKé-GUESSER BOT', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 'https://github.com/GeorgeCiesinski/poke-guesser-bot')
    .setColor(0x00AE86)
    .setDescription("Top 20 Pokémasters in this channel.")
    .setThumbnail('https://raw.githubusercontent.com/GeorgeCiesinski/poke-guesser-bot/master/images/pokemon-trophy.png')
    .setFooter('By borreLore and Pokketmuse', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png');

    // Add fields to Embed
    for (let i = 0; i < Math.max(5, items.length); i++) {

      // Output item in array to console if exists
      if (i < Math.max(0, items.length)) {
        console.log(`${items[i][0]}: ${items[i][1]}`);
      }
      
      // If on the first element, and element exists, create champion
      if (i == 0 && i < items.length) {
        leaderboardEmbed.addFields(
          {name: '---------- CHAMPION ----------', value: 'All hail:'},
          {name: `🏆 ${i+1}. ${items[i][0]}`, value: `${items[i][1]} pokémon caught.`},
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
        leaderboardEmbed.addField(`🏅 ${i+1}. ${items[i][0]}`, `${items[i][1]} pokémon caught.`);
      // If on element 1-4 but element is empty, create TBA
      }  else if (i > 0 && i < 5 && i >= items.length) {
        leaderboardEmbed.addField(`${i+1}. TBA`, 'Position not claimed');
      }

      // Creates table header for overflow leaderboard
      if (i==5) {
        // Creates an array of usernames in items starting from index 5
        const usernames = Array.from(items.slice(5), x => x[0]);
        // Get the longest username in the array
        const longestUsername = usernames.sort((a, b) => {
          return b.length - a.length;
        })[0];
        longestUserLength = longestUsername.length;
        table = 'PLACE | USER ' + ''.padEnd(longestUserLength - 'USER '.length, ' ') + ' | POKEMON\n';
      }

      // Adds additional users into overflow leaderboard up until 20
      if (i >= 5 && i < 20) {
        table += ((i + 1) + '').padEnd('Place '.length, ' ') + '| ' + items[i][0].padEnd(longestUserLength, ' ') + ' | ' + items[i][1] + '\n';
      }

    }

    if (items.length > 5) {
      leaderboardEmbed.addField('--------- REGION RUNNERUPS ---------', "```" + table + "```")
    }
  
  // Sends the completed Embed
  msg.channel.send(leaderboardEmbed);

  }) 
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

    const winner = items[0][0];  // Determine winner of championship and output message
    var delayInMilliseconds = 500;  // 0.5 seconds

    // Output Championship Victor with delay to allow leaderboard to send first
    setTimeout(function() {
      const title = "Champion Decided!";
      const message = `As the Championship draws to a close, the victor stands out from the rest of the competitors!
      
      ${winner}
      
      is presented with the Pokémon Championship trophy in front of thousands of screaming fans, and the championship begins anew!`;
      const image = "https://raw.githubusercontent.com/GeorgeCiesinski/poke-guesser-bot/master/images/pokemon-trophy.png"
      util.embedReply(title, message, msg, image);

      // Erase leaderboard
      emptyLeaderboard(msg);
    }, delayInMilliseconds);
  })
}

// DEBUGGING
function dummyLeaderboard(msg) {
  const leaderboard = {
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
    "Poket-Jedi": 7,
    "#2-Pokemaster": 1,
    "Jebediah": 5,
    "Alfred-Jr": 2,
    "Prof.Oak": 9,
    "Eleven": 11,
    "EtchaTheCatcha": 10,
    "Literally-Jesus": 2,
    "JoeBlow": 4,
    "Mr. Woman": 5
  };
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
    "Poket-Jedi": 7,
    "#2-Pokemaster": 1,
    "Jebediah": 5,
    "Alfred-Jr": 2,
    "Prof.Oak": 9,
    "Eleven": 11,
    "EtchaTheCatcha": 10,
    "Literally-Jesus": 2,
    "JoeBlow": 4,
    "Mr. Woman": 5
  */
  
  db.set("leaderboard", leaderboard);
  console.log('Generated dummy leaderboard.')

  title = "Dummy Leaderboard Generated!";
  message = "A dummy leaderboard with fake players has been generated!";
  util.embedReply(title, message, msg);
}

// Empties leaderboard
function emptyLeaderboard(msg) {
  
  const leaderboard = {};
  db.set("leaderboard", leaderboard);
  console.log('Generated dummy leaderboard.');

  /*
  title = "Leaderboard Reset!";
  message = "The leaderboard has been emptied. Make sure you grab a copy of the last leaderboard if you want to save a copy!";
  util.embedReply(title, message, msg);
  */

}

// Exports each function separately
module.exports.addScore = addScore;
module.exports.showLeaderboard = showLeaderboard;
module.exports.newChampionship = newChampionship;
module.exports.dummyLeaderboard = dummyLeaderboard;
module.exports.emptyLeaderboard = emptyLeaderboard;
