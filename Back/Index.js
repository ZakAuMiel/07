// index.js
require('dotenv').config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const shutdownRoutes = require("./routes/ShutdownRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

//connexion bot discord
const { startBot } = require("./services/discordBot");
startBot();

// Permet à nos controllers d'y accéder
app.set("io", io);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true en prod HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", shutdownRoutes);

server.listen(3000, () => {
  console.log("Serveur backend démarré sur http://localhost:3000");
});
