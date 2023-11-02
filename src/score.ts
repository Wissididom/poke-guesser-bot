import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Database from "./data/postgres";
import Language from "./language";
import Util from "./util";

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
      .setName("score")
      .setNameLocalizations({
        de: "punktzahl",
      })
      .setDescription("Shows the score of someone or yourself")
      .setDescriptionLocalizations({
        de: "Zeigt die Punktzahl von jemandem oder dir selbst an",
      })
      .addSubcommand((subcommand) =>
        subcommand
          .setName("show")
          .setNameLocalizations({
            de: "anzeigen",
          })
          .setDescription("Shows the score of someone or yourself")
          .setDescriptionLocalizations({
            de: "Zeigt die Punktzahl von jemandem oder dir selbst an",
          })
          .addUserOption((option) =>
            option
              .setName("user")
              .setNameLocalizations({
                de: "benutzer",
              })
              .setDescription("The user whose score you want to know")
              .setDescriptionLocalizations({
                de: "Der Benutzer dessen Punktzahl du wissen willst",
              }),
          ),
      );
  }
}
