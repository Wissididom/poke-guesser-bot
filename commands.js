"use strict";
exports.__esModule = true;
var help_1 = require("./help");
var settings_1 = require("./settings");
var leaderboard_1 = require("./leaderboard");
var score_1 = require("./score");
var explore_1 = require("./explore");
var reveal_1 = require("./reveal");
var mod_1 = require("./mod");
var catch_1 = require("./catch");
var Commands = /** @class */ (function () {
    function Commands() {
    }
    Commands.getRegisterObject = function () {
        return {
            'help': help_1["default"].getRegisterObject(),
            'settings': settings_1["default"].getRegisterObject(),
            'leaderboard': leaderboard_1["default"].getRegisterObject(),
            'score': score_1["default"].getRegisterObject(),
            'explore': explore_1["default"].getRegisterObject(),
            'reveal': reveal_1["default"].getRegisterObject(),
            'mod': mod_1["default"].getRegisterObject()
        };
    };
    Commands.help = help_1["default"].help;
    Commands.settings = settings_1["default"].settings;
    Commands.catchModalSubmitted = catch_1["default"].catchModalSubmitted;
    Commands.leaderboard = leaderboard_1["default"].leaderboard;
    Commands.score = score_1["default"].score;
    Commands.explore = explore_1["default"].explore;
    Commands.reveal = reveal_1["default"].reveal;
    Commands.mod = mod_1["default"].mod;
    return Commands;
}());
exports["default"] = Commands;
