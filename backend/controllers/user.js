const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/User')

/**  Fonctions pour s'inscrire ou s'enregistrer **/

// S'inscrire 

exports.signup = (req, res, next) => {
  // Vérification du mot de passe
    // Mots de passe non conforme
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{6,})/.test(req.body.password)) {   // Test password strength
    return res.status(401).json({ error: 'Le mot de passe doit contenir une lettre majuscule, une minuscule et au moins 1 chiffre (6 caractères min)' });
  } else {
    // Mots de passe conforme
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        })
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }
};

// S"enregister

exports.login = (req, res, next) => {
  // Rechercher l'utilisateur
  User.findOne({ email: req.body.email }) 
    // Si l'utilisateur n'existe pas
    .then(user => {
      if (!user) { 
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
    // Si l'utilisateur existe
      bcrypt.compare(req.body.password, user.password) 
        .then(valid => { 
          // Si le mot de passe est incorrect
          if (!valid) { 
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // Si le mot de passe est correct
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '8h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
