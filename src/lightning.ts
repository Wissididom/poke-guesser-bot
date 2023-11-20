import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  GuildMember,
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import Database from "./data/postgres";
import Language from "./language";
import Util from "./util";
import Explore from "./explore";
import enLocalizations from "./languages/slash-commands/en.json";
import deLocalizations from "./languages/slash-commands/de.json";

export default class Lightning {
  static async lightning(
    interaction: ChatInputCommandInteraction,
    db: Database,
    preventDefer: boolean = false,
  ) {
    db.setLightningLoops(
      interaction.guildId!,
      interaction.channelId!,
      interaction.options.getInteger("loops")! - 1,
    );
    Explore.explore(interaction, db, preventDefer);
  }

  static async checkLightning(
    interaction: ChatInputCommandInteraction | ModalSubmitInteraction,
    db: Database,
  ) {
    let loops = await db.getLightningLoops(
      interaction.guildId!,
      interaction.channelId!,
    );
    if (loops) {
      Lightning.explore(interaction!, db);
      loops -= 1;
      if (loops > 0)
        db.setLightningLoops(
          interaction.guildId!,
          interaction.channelId!,
          loops,
        );
      else db.unsetLightningLoops(interaction.guildId!, interaction.channelId!);
    }
  }

  static async explore(
    interaction: ChatInputCommandInteraction | ModalSubmitInteraction,
    db: Database,
    preventDefer: boolean = false,
  ) {
    const lang = await Language.getLanguage(interaction.guildId!, db);
    console.log("Generating a new Pokemon");
    await db.clearEncounters(interaction.guildId!, interaction.channelId!);
    await db.unsetArtwork(interaction.guildId!, interaction.channelId!);
    let pokemon = await Util.generatePokemon();
    await db.addEncounter(
      interaction.guildId!,
      interaction.channelId!,
      pokemon.url.replace(/.+\/(\d+)\//g, "$1"),
      "id",
    );
    let names = await Util.fetchNames(
      pokemon.url.replace(/.+\/(\d+)\//g, "$1"),
    );
    if (!names) {
      console.log(
        `Warning: 404 Not Found for pokemon ${pokemon.url.replace(
          /.+\/(\d+)\//g,
          "$1",
        )}. Fetching new pokemon.`,
      );
      this.explore(interaction, db, true); // Attention: Recursive
      return;
    }
    for (let name of names) {
      // Sets current pokemon (different languages) names in database
      console.log(
        `Guild: ${interaction.guildId}, Channel: ${interaction.channelId}, Name: ${name.name}, Language: ${name.languageName}`,
      );
      await db.addEncounter(
        interaction.guildId!,
        interaction.channelId!,
        name.name,
        name.languageName,
      );
    }
    // Gets sprite url for the reply to the command with the newly generated pokemon
    let sprites = await Util.fetchSprite(pokemon.url);
    let spriteUrl = sprites.front_default;
    if (!spriteUrl) {
      console.log(
        `Warning: front_default sprite for ${pokemon.name} is null. Fetching new pokemon.`,
      );
      this.explore(interaction, db, true); // Attention: Recursive
      return;
    }
    let officialArtUrl = sprites.other.official_artwork.front_default;
    console.log(spriteUrl);
    console.log(officialArtUrl);
    await db.setArtwork(
      interaction.guildId!,
      interaction.channelId!,
      officialArtUrl,
    );
    let returnedEmbed: {
      embed: EmbedBuilder;
      attachment: AttachmentBuilder | null;
    } = Util.returnEmbed(
      lang.obj["explore_wild_pokemon_appeared_title"],
      lang.obj["explore_wild_pokemon_appeared_description"],
      lang,
      0x00ae86,
      spriteUrl,
    );
    let actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId("catchBtn")
        .setLabel(lang.obj["catch_this_pokemon"])
        .setStyle(ButtonStyle.Primary),
    );
    if (returnedEmbed.attachment == null)
      await interaction.followUp({
        embeds: [returnedEmbed.embed],
        components: [actionRow],
      });
    else
      await interaction.followUp({
        embeds: [returnedEmbed.embed],
        files: [returnedEmbed.attachment],
        components: [actionRow],
      });
    await db.setLastExplore(
      interaction.guildId!,
      interaction.channelId!,
      Date.now(),
    );
  }

  static getRegisterObject() {
    return new SlashCommandBuilder()
      .setName(enLocalizations.lightning_name)
      .setNameLocalizations({
        de: deLocalizations.lightning_name,
      })
      .setDescription(enLocalizations.lightning_description)
      .setDescriptionLocalizations({
        de: deLocalizations.lightning_description,
      })
      .addSubcommand((subcommand) =>
        subcommand
          .setName(enLocalizations.lightning_start_name)
          .setNameLocalizations({
            de: deLocalizations.lightning_start_name,
          })
          .setDescription(enLocalizations.lightning_start_description)
          .setDescriptionLocalizations({
            de: deLocalizations.lightning_start_description,
          })
          .addIntegerOption((option) =>
            option
              .setName(enLocalizations.lightning_start_loops_name)
              .setNameLocalizations({
                de: deLocalizations.lightning_start_loops_name,
              })
              .setDescription(enLocalizations.lightning_start_loops_description)
              .setDescriptionLocalizations({
                de: deLocalizations.lightning_start_loops_description,
              })
              .setRequired(true),
          ),
      );
  }
}
