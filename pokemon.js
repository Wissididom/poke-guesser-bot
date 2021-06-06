const fetch = require("node-fetch")

function generatePokemon() {
  // Fetch json of all available pokemon up to a limit of 2000 (~1200 avilable)
  return fetch('https://pokeapi.co/api/v2/pokemon/?limit=2000')
    // Parse to json
    .then(res => {
      return res.json()
    })
    // Extract results
    .then(json => {
      return json.results
    })
    .then(resultList => {
      return resultList[Math.floor(Math.random() * resultList.length)]
    })
}

// Fetches the sprite using the pokemon's api url
function fetchSprite(url) {
  return fetch(url)
    // Converts result to json
    .then(res => {
      return res.json()
    })
    // returns the url of the sprite
    .then(json => {
      return json.sprites.front_default
    })
}

// Exports each function separately
module.exports.generatePokemon = generatePokemon
module.exports.fetchSprite = fetchSprite