// File: authRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

const authController = require("../controllers/authController");
const requireLogin = require("../middlewares/requireLogin");
const { client } = require("../services/discordBot");
const friendRoles = require("../utils/friendRoles.json");

// ────────────────
// 🔐 Authentification Discord
// ────────────────

router.get("/login", authController.login);
router.get("/callback", authController.callback);

// ────────────────
// 📡 Récupération des serveurs Discord (via OAuth2)
// ────────────────

router.get("/discord/guilds", requireLogin, async (req, res) => {
  const accessToken = req.session?.access_token;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { data } = await axios.get(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Serveurs où le bot est aussi présent
    const botGuilds = await client.guilds.fetch();
    const filtered = data.filter((guild) => botGuilds.has(guild.id));

    res.json({ guilds: filtered });
  } catch (err) {
    console.error("❌ Erreur récupération guilds:", err);
    res.status(500).json({ error: "Erreur Discord API" });
  }
});

// ────────────────
// 🛡️ Vérification du rôle du user dans un serveur
// ────────────────

router.get("/verify-role", requireLogin, async (req, res) => {
  const userId = req.session?.user?.id;
  const guildId = req.query.guildId;

  if (!userId || !guildId) {
    return res.status(400).json({ error: "Missing user or guild ID" });
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);

    const role = friendRoles[userId];

    if (role === "ami" || role === "streamer") {
      return res.json({ role });
    } else {
      return res.status(403).json({ error: "Role non autorisé" });
    }
  } catch (err) {
    console.error("❌ Erreur vérif rôle:", err);
    res.status(500).json({ error: "Erreur Discord bot ou permissions manquantes" });
  }
});

module.exports = router;
