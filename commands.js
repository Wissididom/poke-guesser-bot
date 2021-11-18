const { Constants } = require('discord.js');
const helpJS = require('./help.js');
const settingsJS = require('./settings.js');
const catchJS = require('./catch.js');
const leaderboardJS = require('./leaderboard.js');
const scoreJS = require('./score.js');
const exploreJS = require('./explore.js');
const revealJS = require('./reveal.js');
const modJS = require('./mod.js');

function getRegisterObject() {
	return {
		'help': helpJS.getRegisterObject(),
		'settings': settingsJS.getRegisterObject(),
		'catch': catchJS.getRegisterObject(),
		'leaderboard': leaderboardJS.getRegisterObject(),
		'score': scoreJS.getRegisterObject(),
		'explore': exploreJS.getRegisterObject(),
		'reveal': revealJS.getRegisterObject(),
		'mod': modJS.getRegisterObject()
	};
}

module.exports.getRegisterObject = getRegisterObject;
module.exports.help = helpJS.help;
module.exports.settings = settingsJS.settings;
module.exports._catch = catchJS._catch;
module.exports.leaderboard = leaderboardJS.leaderboard;
module.exports.score = scoreJS.score;
module.exports.explore = exploreJS.explore;
module.exports.reveal = revealJS.reveal;
module.exports.mod = modJS.mod;
