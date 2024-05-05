const Database = require("./database.js");

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
    // Unset userId
    delete delays[userId];
    console.log('deleted:' + JSON.stringify(delays));
    // Set database with changes
    db.set("delays", delays);
  });
}

async function getTimeout(userId) {
  return await db.get("timeouts").then(timeouts => {
    if (!timeouts)
      return null;
    return userId in timeouts ? timeouts[userId] : null;
  });
}

function setTimeout(userId, startDateTime, endDateTime) {
  console.log(`disadvantages.setTimeout received userId: ${userId}, ${startDateTime} - ${endDateTime}`);
  db.get("timeouts").then(timeouts => {
    if (!timeouts)
      timeouts = {};
    // Sets userId to the specific start and end date and time
    timeouts[userId] = {
      start: startDateTime,
      end: endDateTime
    }
    console.log('timeouts:' + JSON.stringify(timeouts));
    // Set database with changes
    db.set("timeouts", timeouts);
  });
}

function unsetTimeout(userId) {
  console.log(`disadvantages.unsetTimeout received userId: ${userId}`);
  db.get("timeouts").then(timeouts => {
    if (!timeouts)
      timeouts = {};
    // Unset userId
    delete timeouts[userId];
    console.log('deleted:' + JSON.stringify(timeouts));
    // Set database with changes
    db.set("timeouts", timeouts);
  });
}

module.exports.getDelayInSeconds = getDelayInSeconds;
module.exports.setDelay = setDelay;
module.exports.unsetDelay = unsetDelay;
module.exports.getTimeout = getTimeout;
module.exports.setTimeout = setTimeout;
module.exports.unsetTimeout = unsetTimeout;
