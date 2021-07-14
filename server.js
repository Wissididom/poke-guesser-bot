const express = require("express");
const server = express();

server.all("/", (req, res) => {
  res.send("Bot is running!");
});

// Start serverand listen for ping
function keepAlive() {
  // Listen at port 3000
  server.listen(3000, () => {
    console.log("Server is ready.");
  });
}

module.exports = keepAlive;