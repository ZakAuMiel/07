// controllers/uploadController.js
const path = require("path");

const uploadMedia = async (req, res) => {
    try {
      const { username, avatarUrl, displaySize, duration, message } = req.body;
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ message: 'Aucun fichier reçu' });
      }
  
      const io = req.app.get('io');
  
      const payload = {
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith('video') ? 'video' : 'image',
        username,
        avatarUrl,
        displaySize,
        message
      };
      
      // Duration valide uniquement si : champ non vide ET c’est une image
      if (
        duration &&
        duration !== '' &&
        !isNaN(Number(duration)) 
      ) {
        payload.duration = Number(duration);
      }
      
      //envoi le payload sur le socket
      console.log('Payload envoyé à overlay :', payload);

      io.emit('new-media', payload);
  
      return res.status(200).json({ success: true, file: payload });
    } catch (error) {
      console.error('Erreur upload:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  

  

module.exports = { handleUpload: uploadMedia };
