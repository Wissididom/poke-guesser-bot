import * as DotEnv from "dotenv";
DotEnv.config();
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import Commands from "./commands";

const token = process.env["TOKEN"];

if (!token) {
  throw new Error(
    "TOKEN not found! You must setup the Discord TOKEN as per the README file before running this bot.",
  );
}

const rest = new REST().setToken(token);

const registerArray = Commands.getRegisterArray();

(async () => {
  try {
    console.log(
      `Started refreshing ${registerArray.length} application (/) commands.`,
    );
    const userData: any = await rest.get(Routes.user());
    const userId: string = userData.id;
    const data: any = await rest.put(Routes.applicationCommands(userId), {
      body: registerArray,
    });
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (err) {
    console.error(err);
  }
})();
