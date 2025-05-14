const querystring = require('querystring');
const axios = require('axios');
const whitelist = require('../utils/whitelist');
const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI
} = require('../config/DiscordAuth');

exports.login = (req, res) => {
  const redirect_uri = encodeURIComponent(DISCORD_REDIRECT_URI);
  const scope = encodeURIComponent('identify guilds');

  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`;
  res.redirect(discordUrl);
};

exports.callback = async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send('Code manquant');

  try {
    const params = new URLSearchParams();
    params.append('client_id', DISCORD_CLIENT_ID);
    params.append('client_secret', DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', DISCORD_REDIRECT_URI);
    params.append('scope', 'identify guilds');

    const { data: tokenData } = await axios.post(
      'https://discord.com/api/oauth2/token',
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const { data: userData } = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    // 🔐 Sauvegarder dans la session
    req.session.access_token = tokenData.access_token;
    req.session.refresh_token = tokenData.refresh_token;
    req.session.user = userData;

    console.log(`✅ ${userData.username} connecté (ID: ${userData.id})`);

    // ⚠️ Ne vérifie plus la whitelist ici, ce sera fait après le choix du serveur
    res.redirect('http://localhost:5173/select-server');
  } catch (error) {
    console.error('❌ Discord OAuth2 Error:', error);
    res.status(500).send('Authentication failed');
  }
};
