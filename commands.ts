import Help from "./help.ts";
import Settings from "./settings.ts";
import Leaderboard from "./leaderboard.ts";
import Score from "./score.ts";
import Explore from "./explore.ts";
import Reveal from "./reveal.ts";
import Mod from "./mod.ts";
import Catch from "./catch.ts";

export default class Commands {

    static getRegisterObject() {
        return {
            'help': Help.getRegisterObject(),
            'settings': Settings.getRegisterObject(),
            'leaderboard': Leaderboard.getRegisterObject(),
            'score': Score.getRegisterObject(),
            'explore': Explore.getRegisterObject(),
            'reveal': Reveal.getRegisterObject(),
            'mod': Mod.getRegisterObject()
        }
    }

    static help = Help.help;
    static settings = Settings.settings;
    static catchModalSubmitted = Catch.catchModalSubmitted;
    static leaderboard = Leaderboard.leaderboard;
    static score = Score.score;
    static explore = Explore.explore;
    static reveal = Reveal.reveal;
    static mod = Mod.mod;
}
