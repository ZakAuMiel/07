const express = require('express');
const router = express.Router();

// Route de fermeture manuelle de l'overlay
router.post('/shutdown', (req, res) => {
  const io = req.app.get('io');
  io.emit('shutdown-overlay');
  res.status(200).json({ success: true });
});

module.exports = router;

