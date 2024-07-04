const express = require("express");
const server = express();

server.all("/", (req, res) => {
  const serverMessage = "Bot is running!";
  res.send(serverMessage);
});

// Start serverand listen for ping
function keepAlive() {
  // Listen at port 3001
  server.listen(3001, () => {
    console.log("Server is ready.");
  });
}

module.exports = keepAlive;
