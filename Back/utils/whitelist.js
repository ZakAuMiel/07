// utils/whitelist.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'friendRoles.json');

// ⬇ Charge le fichier JSON en mémoire
function load() {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (e) {
    return {};
  }
}

// ⬆ Sauvegarde un nouvel objet dans le fichier
function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 🎯 Ajoute ou modifie un rôle pour un userId
function setRole(userId, role) {
  const list = load();
  list[userId] = role;
  save(list);
}

// 🎯 Supprime un rôle pour un userId
function remove(userId) {
  const list = load();
  delete list[userId];
  save(list);
}



// 🔎 Récupère le rôle actuel d’un userId
function getRole(userId) {
  const list = load();
  return list[userId];
}


// ✅ Vérifie si ce userId a un rôle autorisé ("ami" ou "streamer")
function isAllowed(userId) {
  const list = load();
  return ['ami', 'streamer'].includes(list[userId]);
}

module.exports = { setRole, getRole, isAllowed,remove, isAllowed };
