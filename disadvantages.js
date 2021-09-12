const Database = require("@replit/database");

const db = new Database();

async function getDelayInSeconds(userId) {
  return await db.get("delays").then(delays => {
    if (!delays)
      return -1;
    return userId in delays ? delays[userId] : -1;
  });
}

function setDelay(userId, hours, minutes, seconds) {
  console.log(`disadvantages.setDelay received userId: ${userId}, ${hours}h${minutes}m${seconds}s`);
  db.get("delays").then(delays => {
    if (!delays)
      delays = {};
    // Set userId to the specific amount of seconds
    delays[userId] = (hours * 60) + (minutes * 60) + seconds;
    console.log('delays:' + JSON.stringify(delays));
    // Set database with changes
    db.set("delays", delays);
  });
}

function unsetDelay(userId) {
  console.log(`disadvantages.unsetDelay received userId: ${userId}`);
  db.get("delays").then(delays => {
    if (!delays)
      delays = {};
    // Unset userId to the specific amount of seconds
    delete delays[userId];
    console.log('deleted:' + JSON.stringify(delays));
    // Set database with changes
    db.set("delays", delays);
  });
}

module.exports.getDelayInSeconds = getDelayInSeconds;
module.exports.setDelay = setDelay;
module.exports.unsetDelay = unsetDelay;
// module.exports.setTimeout = setTimeout;
// module.exports.unsetTimeout = unsetTimeout;
