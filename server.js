const express = require("express");
const server = express();

server.all("/", (req, res) => {
  const serverMessage = "Bot is running!"
  res.send(serverMessage);
});

// Start serverand listen for ping
function keepAlive() {
  // Listen at port 3000
  server.listen(3000, () => {
    console.log("Server is ready.");
  });
}

module.exports = keepAlive;