const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
const CLIENT_ID = process.env.CLIENT_ID;

(async () => {
  try {
    const commands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));

    console.log(`Found ${commands.length} global command(s). Deleting...`);

    for (const command of commands) {
      await rest.delete(
        Routes.applicationCommand(process.env.CLIENT_ID, command.id)
      );
      console.log(`❌ Deleted global command: ${command.name}`);
    }

    console.log('✅ Global commands cleared!');
  } catch (error) {
    console.error(error);
  }
})();
