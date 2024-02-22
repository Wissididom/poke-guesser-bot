import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Database from "./data/postgres";
import Language from "./language";
import Util from "./util";
import enLocalizations from "./languages/slash-commands/en.json";
import deLocalizations from "./languages/slash-commands/de.json";

export default class Score {
  static async score(interaction: ChatInputCommandInteraction, db: Database) {
    await interaction.deferReply({ ephemeral: false }); // PokeBot is thinking
    const lang = await Language.getLanguage(interaction.guildId!, db);
    let title = "";
    let description = "";
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "show":
        let user = interaction.options.getUser("user", false);
        if (!user) user = interaction.user;
        let userScore = await db.getScore(interaction.guildId!, user.id);
        title = user.tag;
        if (userScore)
          description = `**${lang.obj["user"]}**: <@${user.id}>\n**${lang.obj["position"]}**: ${userScore.position}\n**${lang.obj["score"]}**: ${userScore.score}`;
        else
          description = `**${lang.obj["user"]}**: <@${user.id}>\n**${lang.obj["position"]}**: N/A\n**${lang.obj["score"]}**: N/A`;
        break;
    }
    await Util.editReply(interaction, title, description, lang);
  }

  static getRegisterObject() {
    return new SlashCommandBuilder()
      .setName(enLocalizations.score_name)
      .setNameLocalizations({
        de: deLocalizations.score_name,
      })
      .setDescription(enLocalizations.score_description)
      .setDescriptionLocalizations({
        de: deLocalizations.score_description,
      })
      .addSubcommand((subcommand) =>
        subcommand
          .setName(enLocalizations.score_show_name)
          .setNameLocalizations({
            de: deLocalizations.score_show_name,
          })
          .setDescription(enLocalizations.score_show_description)
          .setDescriptionLocalizations({
            de: deLocalizations.score_show_description,
          })
          .addUserOption((option) =>
            option
              .setName(enLocalizations.score_show_user_name)
              .setNameLocalizations({
                de: deLocalizations.score_show_user_name,
              })
              .setDescription(enLocalizations.score_show_user_description)
              .setDescriptionLocalizations({
                de: deLocalizations.score_show_user_description,
              }),
          ),
      );
  }
}
