// middlewares/requireLogin.js
module.exports = (req, res, next) => {
    if (!req.session || !req.session.user || !req.session.access_token) {
      return res.status(401).json({ error: 'Non authentifié via Discord' });
    }
    next();
  };
  