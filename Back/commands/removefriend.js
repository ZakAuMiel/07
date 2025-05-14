// commands/removefriend.js
const { SlashCommandBuilder } = require('discord.js');
const whitelist = require('../utils/whitelist');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removefriend')
    .setDescription('Remove a user from the whitelist')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to remove')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const userId = user.id;

    const current = whitelist.getRole(userId);
    if (!current) {
      return interaction.reply({ content: `❌ ${user.username} is not in the whitelist.`, ephemeral: true });
    }

    whitelist.remove(userId);
    await interaction.reply({ content: `🗑️ ${user.username} was removed from the whitelist.`, ephemeral: true });
  }
};
