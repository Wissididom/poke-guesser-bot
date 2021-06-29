# Poke-guesser Bot

The Poke-guesser Bot is a discord bot which selects random pokemon and asks the user to guess the pokemon name. The bot automatically tracks the score of participating users. It also recognizes a number of admin commands, and player commands such as catching pokemon, and displaying the leaderboard. 

## Progress

This bot project is currently in progress. It is currently able to generate new pokemon, message the discord server, understand guesses, commands, and has a functional leaderboard. There are still a few kinks to be ironed out, including presenting the leaderboard in a nicer way, and adding functionality for the bot to operate in a single channel, and differentiate admin status or roles. 

## Background

This bot was built thanks to one of my friends, Pokketmuse, who reached out to me about this idea. She is a Twitch streamer who has a discord channel where she runs a few custom events for the users in the channel. One of these events is a Pokemon Guessing game she manually operated. In a nutshell, the game was to guess a daily pokemon, and the players were tracked on a leaderboard. Her goal was to practice convert this manual game into a bot, and to practice JavaScript at the same time.

I fell in love with this idea immediately. I have wanted to build a discord bot for a very long time. I also have wanted to apply my JavaScript knowledge for a while as well, but never had a good opportunity. This project gave me an opportunity to kill two birds with one stone, so I got to work right away!

# Usage

## Installation

This bot was intented to run in [replit](https://replit.com) so my installation instructions will be about how to fork this and run it yourself. 

INSTRUCTIONS TBA

## Commands

You can interact with the bot using admin and player commands.

### Admin Commands

Admin commands have the prefix `!`

Full list of admin commands is shown below. Do not include the < > characters.

`!help` : Shows Admin and Player commands.

`!configure`: Shows configure helper

`!add role <role name>`: Adds the role as a bot moderator. The role name must be exactly what it is in Discord, including any emojis. 

`!remove role <role name`: Removes the role from bot moderator.

`!add channel <channel name>`: Adds the channel to list of channels the bot replies to. 

`!remove channel <channel name>`: Removes the channel from list of channels the bot replies to.

`!show config`: Shows bot moderator roles and allowed channels.

`!reset config`: Removes all allowed roles and channels. Bot returns to default configuration where all server members are able to send admin commands, and the bot replies in all channels. **Note:** This default configuration should only be used to configure the bot.

### Player Commands

Player commands have the prefix `$`

Full list of player commands is shown below. Do not include the < > characters. 

`$help`: Shows Admin and Player commands. 

`$catch <pokemon-name>`: Allows player to guess the pokemon. Guessing correctly adds the player to the leaderboard and adds one point.

`$leaderboard`: Shows a leaderboard of top players.

# Technology

## Replit

We used the online IDE [Replit](https://replit.com/~) to program and run Poke-guesser Bot. Thanks to this service, this bot is able to run completely in the cloud, even if the browser session with Replit is closed.

## node.js

This project is written entirely using JavaScript in the [Node.JS](https://nodejs.org/en/) runtime environment. 

## discord.js

All interactions with discord were handled thanks to the [discord.js](https://discord.js.org/#/) library. 

## API

This bot would not be possible without [PokeAPI](https://pokeapi.co/). This API was not only easy to use, but provided a list of all pokemon, including their variants, as well as sprites that were instrumental in building this Poke-guesser Bot. 

# License

TBA

# Contributions

TBA