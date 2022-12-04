import { ApplicationCommandType, ApplicationCommandOptionType, Message, ChatInputCommandInteraction } from "discord.js";
import Database from "./data/postgres";
import Util from "./util";

export default class Leaderboard {

    static async sanitizeLeaderboard(message: Message, leaderboard: {[key: string]: number}) {
        for (const [userId, score] of Object.entries(leaderboard)) {
            let objLength = Object.keys(leaderboard).length;
            let user = await Util.findUser(message, userId);
            if (!user) {
                console.log(`Removing User Id ${userId} from leaderboard.`);
                delete leaderboard[userId];
            }
        }
        return leaderboard;
    }

    static generateLeaderboard(leaderboard: {[key: string]: number}): {[key: string]: number} {
        for (let i = 0; i < 20; i++) {
            let userName = `user${i + 1}`;
            let score = Math.floor(Math.random() * 10);
            leaderboard[userName] = score;
        }
        return leaderboard;
    }

    static async leaderboard(interaction: ChatInputCommandInteraction, db: Database) {
        if (!interaction.guild?.available) {
            await interaction.reply({
                content: 'Guild not available  (leaderboard -> leaderboard -> interaction.guild.available is either null or false)',
                ephemeral: true
            });
            return;
        }
        if (!interaction.guildId) {
            await interaction.reply({
                content: 'Internal Server Error (leaderboard -> leaderboard -> interaction.guildId = null)',
                ephemeral: true
            });
            return;
        }
        await interaction.deferReply({ ephemeral: false }); // PokeBot is thinking
        //const type = interaction.options.getString('type');
        let title = '';
        let description = '';
        // returnEmbed(title, message, image=null)
        await Util.editReply(interaction, title, description);
    }

    static getRegisterObject() {
        return {
            name: 'leaderboard',
            description: 'Shows the Leaderboard',
            type: ApplicationCommandType.ChatInput
        };
    }
}
