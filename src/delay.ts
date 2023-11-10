import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import Database from "./data/postgres";
import Language from "./language";
import Util from "./util";
import enLocalizations from "./languages/slash-commands/en.json";
import deLocalizations from "./languages/slash-commands/de.json";

export default class Delay {
  static async delay(interaction: ChatInputCommandInteraction, db: Database) {
    const lang = await Language.getLanguage(interaction.guildId!, db);
    let subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "set":
        try {
          let d = interaction.options.getInteger("days", false) || 0;
          let h = interaction.options.getInteger("hours", false) || 0;
          let m = interaction.options.getInteger("minutes", false) || 0;
          let s = interaction.options.getInteger("seconds", false) || 0;
          let user = interaction.options.getUser("user");
          if (user) {
            await Delay.setDelay(interaction.guildId!, user.id, d, h, m, s);
            await Util.editReply(
              interaction,
              lang.obj["mod_delay_set_title_success"],
              lang.obj["mod_delay_set_description_success"],
              lang,
            );
          }
        } catch (err) {
          Util.editReply(
            interaction,
            lang.obj["mod_delay_set_title_failed"],
            `${lang.obj["mod_delay_set_description_failed"]}${err}`,
            lang,
          );
        }
        break;
      case "unset":
        try {
          let user = interaction.options.getUser("user");
          if (user) {
            await Delay.unsetDelay(interaction.guildId!, user.id);
            await Util.editReply(
              interaction,
              lang.obj["mod_delay_unset_title_success"],
              lang.obj["mod_delay_unset_description_success"],
              lang,
            );
          }
        } catch (err) {
          await Util.editReply(
            interaction,
            lang.obj["mod_delay_unset_title_failed"],
            `${lang.obj["mod_delay_unset_description_failed"]}${err}`,
            lang,
          );
        }
        break;
      case "show":
        try {
          let user = interaction.options.getUser("user");
          if (user) {
            await Delay.showDelay(interaction.guildId!, user.id);
            await Util.editReply(
              interaction,
              lang.obj["mod_delay_show_title_success"],
              lang.obj["mod_delay_show_description_success"],
              lang,
            );
          }
        } catch (err) {
          await Util.editReply(
            interaction,
            lang.obj["mod_delay_show_title_failed"],
            `${lang.obj["mod_delay_show_description_failed"]}${err}`,
            lang,
          );
        }
        break;
      default:
        await Util.editReply(
          interaction,
          lang.obj["error_invalid_subcommand_title"],
          lang.obj["error_invalid_subcommand_description"]
            .replace("<commandName>", interaction.commandName)
            .replace("<subcommandName>", subcommand),
          lang,
        );
    }
  }

  private static async setDelay(
    serverId: string,
    userId: string,
    days: number = 0,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
  ) {
    // TODO: Execute Delay Actions
  }

  private static async unsetDelay(serverId: string, userId: string) {
    // TODO: Execute Delay Actions
  }

  private static async showDelay(serverId: string, userId: string) {
    // TODO: Execute Delay Actions
  }

  static getRegisterObject(
    subcommandgroup: SlashCommandSubcommandGroupBuilder,
  ): SlashCommandSubcommandGroupBuilder {
    return subcommandgroup
      .setName(enLocalizations.delay_name)
      .setNameLocalizations({
        de: deLocalizations.delay_name,
      })
      .setDescription(enLocalizations.delay_description)
      .setDescriptionLocalizations({
        de: deLocalizations.delay_description,
      })
      .addSubcommand((subcommand) =>
        subcommand
          .setName(enLocalizations.delay_set_name)
          .setNameLocalizations({
            de: deLocalizations.delay_set_name,
          })
          .setDescription(enLocalizations.delay_set_description)
          .setDescriptionLocalizations({
            de: deLocalizations.delay_set_description,
          })
          .addUserOption((option) =>
            option
              .setName(enLocalizations.delay_set_user_name)
              .setNameLocalizations({
                de: deLocalizations.delay_set_user_name,
              })
              .setDescription(enLocalizations.delay_set_user_description)
              .setDescriptionLocalizations({
                de: deLocalizations.delay_set_user_description,
              })
              .setRequired(true),
          )
          .addIntegerOption((option) =>
            option
              .setName(enLocalizations.delay_set_days_name)
              .setNameLocalizations({
                de: deLocalizations.delay_set_days_name,
              })
              .setDescription(enLocalizations.delay_set_days_description)
              .setDescriptionLocalizations({
                de: deLocalizations.delay_set_days_description,
              }),
          )
          .addIntegerOption((option) =>
            option
              .setName(enLocalizations.delay_set_hours_name)
              .setNameLocalizations({
                de: deLocalizations.delay_set_hours_name,
              })
              .setDescription(enLocalizations.delay_set_hours_description)
              .setDescriptionLocalizations({
                de: deLocalizations.delay_set_hours_description,
              }),
          )
          .addIntegerOption((option) =>
            option
              .setName(enLocalizations.delay_set_minutes_name)
              .setNameLocalizations({
                de: deLocalizations.delay_set_minutes_name,
              })
              .setDescription(enLocalizations.delay_set_minutes_description)
              .setDescriptionLocalizations({
                de: deLocalizations.delay_set_minutes_description,
              }),
          )
          .addIntegerOption((option) =>
            option
              .setName(enLocalizations.delay_set_seconds_name)
              .setNameLocalizations({
                de: deLocalizations.delay_set_seconds_name,
              })
              .setDescription(enLocalizations.delay_set_seconds_description)
              .setDescriptionLocalizations({
                de: deLocalizations.delay_set_seconds_name,
              }),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(enLocalizations.delay_unset_name)
          .setNameLocalizations({
            de: deLocalizations.delay_unset_name,
          })
          .setDescription(enLocalizations.delay_unset_description)
          .setDescriptionLocalizations({
            de: deLocalizations.delay_unset_description,
          })
          .addUserOption((option) =>
            option
              .setName(enLocalizations.delay_unset_user_name)
              .setNameLocalizations({
                de: deLocalizations.delay_unset_user_name,
              })
              .setDescription(enLocalizations.delay_unset_user_description)
              .setDescriptionLocalizations({
                de: deLocalizations.delay_unset_user_description,
              })
              .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(enLocalizations.delay_show_name)
          .setNameLocalizations({
            de: deLocalizations.delay_show_name,
          })
          .setDescription(enLocalizations.delay_show_description)
          .setDescriptionLocalizations({
            de: deLocalizations.delay_show_description,
          })
          .addUserOption((option) =>
            option
              .setName(enLocalizations.delay_show_user_name)
              .setNameLocalizations({
                de: deLocalizations.delay_show_user_name,
              })
              .setDescription(enLocalizations.delay_show_user_description)
              .setDescriptionLocalizations({
                de: deLocalizations.delay_show_user_description,
              })
              .setRequired(true),
          ),
      );
  }
}
