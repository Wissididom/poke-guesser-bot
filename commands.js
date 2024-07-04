const { SlashCommandBuilder } = require("discord.js");
//import { SlashCommandBuilder } from "discord.js";

module.exports.getRegisterArray = () => {
	return [
		new SlashCommandBuilder()
		.setName("explore")
		.setDescription("Generate a new pokemon"),
		new SlashCommandBuilder()
		.setName("reveal")
		.setDescription("Reveals the current pokemon")
	];
};
