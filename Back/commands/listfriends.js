// commands/listfriends.js
const { SlashCommandBuilder } = require('discord.js');
const whitelist = require('../utils/whitelist');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listfriends')
    .setDescription('List all users in the whitelist'),

  async execute(interaction) {
    const roles = require('../utils/friendRoles.json');

    if (Object.keys(roles).length === 0) {
      return interaction.reply({ content: '👥 The whitelist is empty.', ephemeral: true });
    }

    let message = '📜 **Whitelisted users:**\n';
    for (const [userId, role] of Object.entries(roles)) {
      message += `- <@${userId}> → \`${role}\`\n`;
    }

    await interaction.reply({ content: message, ephemeral: true });
  }
};
