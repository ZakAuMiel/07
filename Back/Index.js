// index.js
const express = require('express');       // Crée un serveur HTTP
const http = require('http');             // Nécessaire pour intégrer socket.io à Express
const { Server } = require('socket.io');  // Serveur WebSocket
const multer = require('multer');         // Permet de gérer les uploads
const cors = require('cors');             // Autorise les connexions depuis d'autres domaines (ex: React)
const path = require('path');             // Gère les chemins de fichiers

const app = express();                    // Crée l'app Express
const server = http.createServer(app);    // Crée un serveur HTTP à partir de Express
const io = new Server(server, {           // Crée le serveur WebSocket
  cors: { origin: "*" }                   // Autorise toutes les connexions (temporairement)
});

app.use(cors());                          // Autorise les requêtes cross-origin
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Sert les fichiers statiques
app.use(express.json());                 // Pour lire du JSON (utile si tu veux ajouter des routes plus tard)
app.use(express.urlencoded({ extended: true })); // Pour lire les données de formulaire

 //gestion des fichiers uploadés
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Envoi d'un fichier avec infos de l'utilisateur et taille de l'image ou vidéo
app.post('/send', upload.single('media'), (req, res) => {
  const { username, avatar, size } = req.body;
  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;

  io.emit('new-media', {
    url: fileUrl,
    type: req.file.mimetype.includes('video') ? 'video' : 'image',
    username,
    avatar,
    size
  });

  res.json({ status: 'ok' });
});

server.listen(3001, () => {
  console.log('▶ Backend 07 running on http://localhost:3001');
});
