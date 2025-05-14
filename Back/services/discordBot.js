const {
    Client,
    GatewayIntentBits,
    Events,
    Collection,
    REST,
    Routes
  } = require('discord.js');
  
  const dotenv = require('dotenv');
  const fs = require('fs');
  const path = require('path');
  dotenv.config();

  const guildId = '1372250240597622985'; // Remplacez par l'ID de votre serveur
  
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });
  
  // Chargement dynamique des commandes
  client.commands = new Collection();
  const commands = [];
  
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
  
    if (!command.data || !command.execute) {
      console.warn(`⚠️ Command file "${file}" is missing required properties.`);
      continue;
    }
  
    console.log(`📦 Loaded command: ${command.data.name}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
  
  client.once(Events.ClientReady, async () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
  
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  
    try {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, guildId),
        { body: commands },
      );
  
      console.log(`🚀 Slash commands registered: ${commands.map(c => c.name).join(', ')}`);
    } catch (err) {
      console.error('❌ Failed to register slash commands:', err);
    }
  });
  
  // Gestion des interactions
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`❌ Error executing command "${interaction.commandName}":`, err);
      await interaction.reply({
        content: '❌ An error occurred while executing this command.',
        ephemeral: true
      });
    }
  });
  
  module.exports = {
    startBot: () => client.login(process.env.DISCORD_BOT_TOKEN),
    client
  };
  