const { User } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const privateKey = process.env.AUTH_PRIVATE_KEY;

  
module.exports = (app) => {
  app.post('/api/login', (req, res) => {
  
    User.findOne({ where: { username: req.body.username } }).then(user => {
      if (!user) {
        const message = "Erreur d'identification. Vérifiez vos Login et Mot de Passe.";
        return res.status(401).json({message})
      }
      bcrypt.compare(req.body.password, user.password)
      .then(isPasswordValid => {
        if(!isPasswordValid) {
          const message = `Erreur d'identification. Vérifiez vos Login et Mot de Passe.`;
          return res.status(401).json({ message });
        } else {
          // JWT
          const token = jwt.sign(
            { userId: user.id }, 
            privateKey,
            { expiresIn: '24h'}
            );
          const message = `L'utilisateur a été connecté avec succès`;
          return res.json({ message, data: user, token });
        }
      })
      .catch(error => {
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`;
        return res.json( {message, data: error});
      })
    })
  })
}