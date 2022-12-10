"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var language_1 = require("./language");
var util_1 = require("./util");
var Catch = /** @class */ (function () {
    function Catch() {
    }
    Catch.catchModalSubmitted = function (btnInteraction, modalInteraction, db) {
        return __awaiter(this, void 0, void 0, function () {
            var guess, lang, encounter, guessed, i, artwork, englishIndex, j, title, returnedEmbed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, modalInteraction.deferUpdate()];
                    case 1:
                        _a.sent(); // PokeBot is thinking
                        Catch.guessEntered = true;
                        guess = modalInteraction.fields.getTextInputValue('guess');
                        console.log("".concat(modalInteraction.user.tag, " guessed ").concat(guess));
                        if (modalInteraction.guild && !modalInteraction.guild.available || !modalInteraction.guild)
                            return [2 /*return*/];
                        return [4 /*yield*/, language_1["default"].getLanguage(modalInteraction.guild.id, db)];
                    case 2:
                        lang = _a.sent();
                        return [4 /*yield*/, db.getEncounter(modalInteraction.guild.id, btnInteraction.channelId)];
                    case 3:
                        encounter = _a.sent();
                        if (!(encounter.length > 0)) return [3 /*break*/, 14];
                        guessed = false;
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < encounter.length)) return [3 /*break*/, 11];
                        if (!(encounter[i].name.toLowerCase() === guess.toLowerCase())) return [3 /*break*/, 10];
                        return [4 /*yield*/, db.clearEncounters(modalInteraction.guild.id, btnInteraction.channelId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, db.getArtwork(modalInteraction.guild.id, btnInteraction.channelId)];
                    case 6:
                        artwork = _a.sent();
                        return [4 /*yield*/, db.addScore(modalInteraction.guild.id, btnInteraction.user.id, 1)];
                    case 7:
                        _a.sent();
                        englishIndex = 0;
                        for (j = 0; j < encounter.length; j++) {
                            if (encounter[j].language === 'en')
                                englishIndex = j;
                        }
                        title = '';
                        if (encounter[i].name.toLowerCase() === encounter[englishIndex].name.toLowerCase())
                            title = lang.obj['catch_caught_english_title'].replace('<pokemon>', util_1["default"].capitalize(encounter[englishIndex].name));
                        else
                            title = lang.obj['catch_caught_other_language_title'].replace('<englishPokemon>', util_1["default"].capitalize(encounter[englishIndex].name)).replace('<guessedPokemon>', util_1["default"].capitalize(encounter[i].name));
                        console.log("catch.js-artwork: ".concat(artwork));
                        returnedEmbed = util_1["default"].returnEmbed(title, lang.obj['catch_caught_description'].replace('<guesser>', "<@".concat(btnInteraction.user.id, ">")), 0x00AE86, artwork);
                        // returnEmbed(title, message, image=null)
                        return [4 /*yield*/, btnInteraction.followUp({
                                embeds: [
                                    returnedEmbed.embed
                                ],
                                files: [
                                    returnedEmbed.attachment
                                ],
                                ephemeral: false
                            })];
                    case 8:
                        // returnEmbed(title, message, image=null)
                        _a.sent();
                        guessed = true;
                        return [4 /*yield*/, db.unsetArtwork(modalInteraction.guild.id, btnInteraction.channelId)];
                    case 9:
                        _a.sent();
                        this.guessEntered = false; // Reset guessEntered
                        //break;
                        return [2 /*return*/, true];
                    case 10:
                        i++;
                        return [3 /*break*/, 4];
                    case 11:
                        if (!!guessed) return [3 /*break*/, 13];
                        return [4 /*yield*/, btnInteraction.followUp({
                                embeds: [
                                    util_1["default"].returnEmbed(lang.obj['catch_guess_incorrect_title'], lang.obj['catch_guess_incorrect_description'])
                                ]
                            })];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13: return [3 /*break*/, 16];
                    case 14: 
                    // returnEmbed(title, message, image=null)
                    return [4 /*yield*/, btnInteraction.followUp({
                            embeds: [
                                util_1["default"].returnEmbed(lang.obj['catch_no_encounter_title'], lang.obj['catch_no_encounter_description'])
                            ],
                            ephemeral: true
                        })];
                    case 15:
                        // returnEmbed(title, message, image=null)
                        _a.sent();
                        this.guessEntered = false; // Reset guessEntered
                        _a.label = 16;
                    case 16: return [2 /*return*/, false];
                }
            });
        });
    };
    Catch.guessEntered = false;
    return Catch;
}());
exports["default"] = Catch;
