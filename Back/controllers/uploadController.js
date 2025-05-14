const path = require("path");

const uploadMedia = async (req, res) => {
  try {
    const {
      username,
      avatarUrl,
      displaySize,
      duration,
      message,
      externalUrl
    } = req.body;

    const file = req.file;
    const io = req.app.get('io');

    // 🧠 Déterminer la source du média (priorité au lien externe)
    let mediaUrl = null;
    let type = 'image'; // par défaut

    if (externalUrl && externalUrl.trim() !== '') {
      mediaUrl = externalUrl.trim();
      type = mediaUrl.includes('youtu') || mediaUrl.includes('tiktok') || mediaUrl.includes('mp4')
        ? 'video'
        : 'image';
    } else if (file) {
      mediaUrl = `/uploads/${file.filename}`;
      type = file.mimetype.startsWith('video') ? 'video' : 'image';
    } else {
      return res.status(400).json({ message: 'Aucun média fourni' });
    }

    const payload = {
      url: mediaUrl,
      type,
      username,
      avatarUrl,
      displaySize,
      message
    };

    if (
      duration &&
      duration !== '' &&
      !isNaN(Number(duration))
    ) {
      payload.duration = Number(duration);
    }

    console.log('🎬 Payload envoyé à overlay :', payload);
    io.emit('new-media', payload);

    return res.status(200).json({ success: true, file: payload });
  } catch (error) {
    console.error('❌ Erreur upload:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { handleUpload: uploadMedia };
