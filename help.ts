import { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import Util from "./util";
import Language from "./language";
import Database from "./data/postgres";

export default class Help {

    static async help(interaction: ChatInputCommandInteraction, db: Database) {
        if (!interaction.guild?.available) {
            await interaction.reply({
                content: 'Guild not available  (help -> help -> interaction.guild.available is either null or false)',
                ephemeral: true
            });
            return;
        }
        if (!interaction.guildId) {
            await interaction.reply({
                content: 'Internal Server Error (help -> help -> interaction.guildId = null)',
                ephemeral: true
            });
            return;
        }
        await interaction.deferReply({ ephemeral: false }); // PokeBot is thinking
        const lang = await Language.getLanguage(interaction.guildId, db);
        const type = interaction.options.getString('type');
        let title = '';
        let description = '';
        switch (type) {
            case 'admin':
                title = lang.obj['help_admin_title'];
                description = `\`/settings mods add <role or user>\` - ${lang.obj['help_settings_mods_add']}` +
                                `\`/settings mods remove <role or user>\` - ${lang.obj['help_settings_mods_remove']}` +
                                `\`/settings mods show\` - ${lang.obj['help_settings_mods_show']}` +
                                `\`/settings mods help\` - ${lang.obj['help_settings_mods_help']}` +
                                `\`/settings channels add <channel>\` - ${lang.obj['help_settings_channels_add']}` +
                                `\`/settings channels remove <channel>\` - ${lang.obj['help_settings_channels_remove']}` +
                                `\`/settings channels show\` - ${lang.obj['help_settings_channels_show']}` +
                                `\`/settings channels help\` - ${lang.obj['help_settings_channels_help']}` +
                                `\`/settings show\` - ${lang.obj['help_settings_show']}` +
                                `\`/settings reset\` - ${lang.obj['help_settings_reset']}` +
                                `\`/settings help\` - ${lang.obj['help_settings_help']}`;
                break;
            case 'mod':
                title = lang.obj['help_mod_title'];
                description = `\`/explore\` - ${lang.obj['help_explore']}` +
                                `\`/reveal\` - ${lang.obj['help_reveal']}` +
                                `\`/mod score add <user> [<score>]\` - ${lang.obj['help_mod_score_add']}` +
                                `\`/settings mods help\` - ${lang.obj['help_settings_mods_help']}` +
                                `\`/mod score remove <user> [<score>]\` - ${lang.obj['help_mod_score_remove']}` +
                                `\`/mod score set <user> [<score>]\` - ${lang.obj['help_mod_score_set']}` +
                                `\`/mod delay set <user> <delay>\` - ${lang.obj['help_mod_delay_set']}` +
                                `\`/mod delay unset <user>\` - ${lang.obj['help_mod_delay_unset']}` +
                                `\`/mod delay show <user>\` - ${lang.obj['help_mod_delay_show']}` +
                                `\`/mod timeout set <user> <timeout>\` - ${lang.obj['help_mod_timeout_set']}` +
                                `\`/mod timeout unset <user>\` - ${lang.obj['help_mod_timeout_unset']}` +
                                `\`/mod timeout show <user>\` - ${lang.obj['help_mod_timeout_show']}` +
                                `\`/mod championship new\` - ${lang.obj['help_mod_championship_new']}`;
                break;
            case 'player':
                title = lang.obj['help_player_title'];
                description = `\`/catch <pokemon>\` - ${lang.obj['help_catch']}` +
                                `\`/leaderboard\` - ${lang.obj['help_leaderboard']}` +
                                `\`/score show [<user>]\` - ${lang.obj['help_score_show']}`;
                break;
        }
        Util.editReply(interaction, title, description);
    }

    static getRegisterObject() {
        return {
            name: 'help',
            description: 'Shows help in an ephemeral message',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'type',
                    description: 'Choose which help to show',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        {
                            name: 'admin',
                            value: 'admin'
                        },
                        {
                            name: 'mod',
                            value: 'mod'
                        },
                        {
                            name: 'player',
                            value: 'player'
                        }
                    ]
                }
            ]
        };
    }
}
