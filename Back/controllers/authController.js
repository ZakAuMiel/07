const querystring = require('querystring');
const axios = require('axios');
const whitelist = require('../utils/whitelist');

exports.login = (req, res) => {
  const redirect_uri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const scope = encodeURIComponent('identify');
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`);
};

exports.callback = async (req, res) => {
  const code = req.query.code;

  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);
    params.append('scope', 'identify');

    const { data: tokenData } = await axios.post('https://discord.com/api/oauth2/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { data: userData } = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (whitelist.includes(userData.username)) {
      res.redirect(`/upload?user=${userData.username}`);
    } else {
      res.status(403).send('Access Denied');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Authentication failed');
  }
};
