# 🫡 (o7)

This project allows streamers to receive and display user-generated media (images or videos) in real time on their OBS overlay via a clean web dashboard.

## 🌐 What is it?

A complete Node.js application with:

* A front-end form to upload videos/images with a username, avatar, and custom message
* A Socket.IO overlay that displays the media in OBS with fade-in/out effects
* An emergency shutdown button to close the overlay manually

## 📦 Features

* ♻️ Real-time media transmission to OBS overlay via WebSocket (Socket.IO)
* 🖼️ Image and video support with automatic playback
* 🎭 Username, avatar, and custom text message support
* ⏱️ Custom or default display duration (5s for images by default)
* ✨ GSAP-based appearance/disappearance animations
* 🛑 Admin shutdown button to forcibly hide the overlay

## 🧹 Folder Structure

### Back-end

```
Back/
├── config/
│   └── DiscordAuth.js
├── controllers/
│   ├── authController.js
│   └── uploadController.js
├── middlewares/
│   └── multerConfig.js
├── routes/
│   ├── authRoutes.js
│   ├── ShutdownRoutes.js
│   └── uploadRoutes.js
├── uploads/               # Where media files are stored
├── utils/
├── index.js               # Entry point (loads all routes)
```

### Front-end (local mode)

```
overlay/
├── overlay.html           # The actual OBS browser overlay
├── upload.html            # Upload interface for the streamer (and later friends)
```

## ⚡ Local Mode (current status)

* 🛠️ An **online front-end dashboard built with Vue 3** is currently under development

* ✅ Works fully in **local mode**: streamer hosts the front-end locally (e.g. open `upload.html` and `overlay.html` in a browser or embed in OBS)

* ❌ Currently no public URL or hosted panel

* ⏳ **Future plans** include:

  * Discord login and authentication
  * Admin dashboard to manage friend list
  * Discord bot integration to invite/whitelist friends
  * Friends can upload GIFs, images, and videos via their own interface

## 🚀 How to Run

1. **Install dependencies**:

```bash
npm install
```

2. **Start the server**:

```bash
node index.js
```

3. **Access the dashboard (upload.html)**
   Open `overlay/upload.html` in your browser to send media

4. **Display overlay**:
   Open `overlay/overlay.html` as a browser source in OBS

## 🔒 Notes

* You must serve both front-end files (`upload.html` and `overlay.html`) via local file or embed in OBS.
* CORS is enabled to allow WebSocket connections from OBS and upload front-end.
* Socket.IO is used to transmit events from upload to overlay.

## ✨ Credits

Created by Zakaria Oubbéa — powered by Node.js, Express, Socket.IO, and GSAP.

---

Happy streaming!
