import Help from "./help";
import Settings from "./settings";
import Leaderboard from "./leaderboard";
import Score from "./score";
import Explore from "./explore";
import Lightning from "./lightning";
import Reveal from "./reveal";
import Mod from "./mod";
import Catch from "./catch";

export default class Commands {
  static getRegisterArray() {
    return [
      Help.getRegisterObject(),
      Settings.getRegisterObject(),
      Leaderboard.getRegisterObject(),
      Score.getRegisterObject(),
      Explore.getRegisterObject(),
      Lightning.getRegisterObject(),
      Reveal.getRegisterObject(),
      Mod.getRegisterObject(),
    ];
  }

  static help = Help.help;
  static settings = Settings.settings;
  static catchModalSubmitted = Catch.catchModalSubmitted;
  static leaderboard = Leaderboard.leaderboard;
  static score = Score.score;
  static explore = Explore.explore;
  static lightning = Lightning.lightning;
  static reveal = Reveal.reveal;
  static mod = Mod.mod;
}
