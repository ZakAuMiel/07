// commands/setrole.js
const { SlashCommandBuilder } = require('discord.js');
const whitelist = require('../utils/whitelist');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setrole')
    .setDescription('Assign a role (ami or streamer) to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to assign a role to')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('role')
        .setDescription('Role to assign (ami or streamer)')
        .setRequired(true)
        .addChoices(
          { name: 'ami', value: 'ami' },
          { name: 'streamer', value: 'streamer' }
        )),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getString('role');

    whitelist.setRole(user.id, role);

    await interaction.reply({
      content: `✅ ${user.username} has been assigned the role **${role}**.`,
      ephemeral: true
    });
  }
};
