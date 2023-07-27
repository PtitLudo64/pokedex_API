const { Sequelize, DataTypes } = require('sequelize');
const PokemonModel = require('../models/pokemon');
const UserModel = require('../models/user');
const pokemons = require('./mock-pokemons');
const bcrypt = require('bcrypt');
const env = require('dotenv').config();
  
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_URL,
  dialect: process.env.DB_ENGINE,
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
});
  
const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const debug = false;
  
const initDb = () => {
  // return sequelize.sync({force: true}).then(_ => { // Recréé la table et son contenu.
  return sequelize.sync().then(_ => {
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types.join()
      }).then(pokemon => {
        if (debug)
          console.log(pokemon.toJSON())
      }).catch(error => {
        console.log(`Synhcro data : Une erreur "${error}" est survenue ${pokemon.name}\n`);
      });
    });

    bcrypt.hash(process.env.API_USER_PWD, 10, (err, hash) => {
      User.create({
        username: process.env.API_USER,
        password: hash
      })
      .then(user => { if (debug) 
        console.log(user.id, user.username, user.password)
      })
      .catch(error => console.log(`User : Une erreur "${error}" s'est produite.`));
    });


    console.log('La base de donnée a bien été initialisée !');
  })
};
  
module.exports = { 
  initDb, Pokemon, User
};