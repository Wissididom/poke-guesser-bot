# Poké-guesser Bot

The Poké-guesser Bot is a discord bot which selects random pokémon and asks the user to guess the pokémon name. The bot automatically tracks the score of participating users. It also recognizes a number of admin commands, and player commands such as catching pokémon, and displaying the leaderboard. 

## Progress

This bot project is currently in progress. It is currently able to generate new pokémon, message the discord server, understand guesses, commands, and has a functional leaderboard. There are still a few kinks to be ironed out, including presenting the leaderboard in a nicer way, and adding functionality for the bot to operate in a single channel, and differentiate admin status or roles. 

## Background

This bot was built thanks to one of my friends, Pokketmuse, who reached out to me about this idea. She is a Twitch streamer who has a discord channel where she runs a few custom events for the users in the channel. One of these events is a Pokémon Guessing game she manually operated. In a nutshell, the game was to guess a daily pokémon, and the players were tracked on a leaderboard. Her goal was to practice convert this manual game into a bot, and to practice JavaScript at the same time.

I fell in love with this idea immediately. I have wanted to build a discord bot for a very long time. I also have wanted to apply my JavaScript knowledge for a while as well, but never had a good opportunity. This project gave me an opportunity to kill two birds with one stone, so I got to work right away!

# Usage

## Commands

Poke-guesser bot recognizes commands from Admins and Mods (make sure that you add the role first!) which are for moderating the bot. It also recognizes regular player commands for playing the game.

### Admin Commands

Admin commands have the prefix `!`

Full list of admin commands is shown below. Do not type the < > characters.

`!help` : Shows Admin and Player commands.

`!configure`: Shows configure helper.

`!add role <role name>`: Adds the role as a bot moderator. The role name must be exactly what it is in Discord, including any emojis. 

`!remove role <role name>`: Removes the role from bot moderator.

`!add channel <channel name>`: Adds the channel to list of channels the bot replies to. 

`!remove channel <channel name>`: Removes the channel from list of channels the bot replies to.

`!show config`: Shows bot moderator roles and allowed channels.

`!reset config`: Removes all allowed roles and channels. Bot returns to default configuration where all server members are able to send admin commands, and the bot replies in all channels. **Note:** This default configuration should only be used to configure the bot.

### Player Commands

Player commands have the prefix `$`

Full list of player commands is shown below. Do not include the < > characters. 

`$help`: Shows Admin and Player commands. 

`$catch <pokémon-name>`: Allows player to guess the pokémon. Guessing correctly adds the player to the leaderboard and adds one point.

`$leaderboard`: Shows a leaderboard of top players.

# Installation

## Setup Discord Bot

This step is important if you haven't done this before. Before you can use this repo, you need to login to the Discord Developer Portal and create a bot, then add the bot into the correct server. Follow the instructions below:

1. Login to the Discord Developer portal and create a bot using [these instructions](https://discordjs.guide/preparations/setting-up-a-bot-application.html#keeping-your-token-safe).

2. Copy the token by clicking the copy button. Save this for a future step.
![bot-2](images/bot-2.png)

3. Click the OAuth2 button, then click bot.
![bot-3](images/bot-3.png)

4. Scroll down to the bot permissions. Select the permissions from the below screenshot.
![bot-4](images/bot-4.png)

5. Click copy above the bot permissions, and paste it into your browser.

6. Choose a server to invite the bot to, then click authorize.

## Replit

This bot was intented to run in [replit](https://replit.com) so my installation instructions will be about how to fork this and run it yourself using Replit. 

1. Login to your Replit account, or sign up if you don't have an account.

2. Go to the Replit link for the project: https://replit.com/@GeorgeKhan/poke-guesser-bot

3. Click Fork to fork it to your own account.
 ![replit-3](images/replit-3.png)

4. On the left hand side, click the Secrets button (lock icon). Create a new secret with the key `TOKEN` and paste the token you copied when creating the discord bot into the value box. Click `Add new secret` to finish creating the secret. This is what the bot will use to login to your discord bot.

5. 

## Running locally

I wont go into too much detail for this as I haven't ran it this way, but you just need to fork the repo and run the index.js file if you want to run this locally. 

# Technology

## Replit

We used the online IDE [Replit](https://replit.com/~) to create Poke-guesser Bot. The bot is intended to be ran straight from Replit so that it is hosted in the cloud.

## node.js

This project is written entirely using JavaScript in the [Node.JS](https://nodejs.org/en/) runtime environment. 

## discord.js

All interactions with discord were handled thanks to the [discord.js](https://discord.js.org/#/) library. 

## API

This bot would not be possible without [PokeAPI](https://pokeapi.co/). This API was not only easy to use, but provided a list of all pokémon, including their variants, as well as sprites that were instrumental in building this Poke-guesser Bot. 

# Contributions

Contributions aren't being accepted as this was a short-term project, but feel free to fork and modify this for your own needs. 

# License

[MIT](https://choosealicense.com/licenses/mit/)

# Additional Credit

Replit Cover Image by [Louise McSharry](https://pixabay.com/users/2funki4wheelz-2863996/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1513925) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1513925)

Leaderboard Image by [Aurelia Candeloro](www.instagram.com/aurelia.borealis)