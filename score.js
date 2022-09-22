const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const language = require('./language.js');
const util = require("./util");

// Shows User Position and Score
async function score(interaction, db) {
	await interaction.deferReply(); // PokeBot is thinking
	const lang = await language.getLanguage(interaction.guildId, db);
	let title = '';
	let description = '';
	const subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case 'show': // /score show
			let user = interaction.options.getUser('user', false);
			let userScore = null;
			if (!user)
				user = interaction.user;
			userScore = await db.getScore(interaction.guildId, user.id);
			title = user.tag;
			if (userScore)
				description = `**User**: <@${user.id}>\n**Position**: ${userScore.position}\n**Score:**: ${userScore.score}`;
			else
				description = `**User**: <@${user.id}>\n**Position**: N/A\n**Score:**: N/A`;
			break;
	}
	// returnEmbed(title, message, image=null)
	interaction.editReply({
		embeds: [util.returnEmbed(title, description)]
	});
}

function getRegisterObject() {
	return {
		name: 'score',
		description: 'Shows the score of someone or yourself',
		type: ApplicationCommandType.ChatInput,
		options: [
			{
				name: 'show',
				description: 'Shows the Score of someone or yourself',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						description: 'The user whose score you want to know',
						required: false,
						type: ApplicationCommandOptionType.User
					}
				]
			}
		]
	};
}

// Exports each function separately
module.exports.score = score;
module.exports.getRegisterObject = getRegisterObject;
