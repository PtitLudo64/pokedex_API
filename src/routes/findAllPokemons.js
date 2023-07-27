// const pokemons = require('../db/mock-pokemons');
const { Pokemon } = require('../db/sequelize');
const { Op } = require('sequelize');
const auth = require('../auth/auth');

module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => {
  const limitMax = parseInt(req.query.limit) || 5;

    if (req.query.name) {
      const name = req.query.name;
      if (name.length < 2) {
        const message = `le terme de recherche doit contenir au minimum 2 caractères.`;
        return res.status(400).json({message});
      }
      return Pokemon.findAndCountAll({ 
        where: { 
          name : { // propriété du modèle pokemon
            [Op.like]: `%${name}%` // 'name' est le critère de recherche.
          }
        },
        order: ['name'],
        limit: limitMax  // limite le nombre de résultats de recherche
      })
      .then(({count, rows}) => {
        const message = `Il y a ${count} Pokemons qui correspondent à la recherche '${name}'.`;
        res.json({ message, data: rows });
      });
    } else {
      Pokemon.findAll( {order: ['name'], limit: limitMax })
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.';
        res.json( { message, data: pokemons } );
      })
      .catch(error => {
        const message = `La liste des Pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.`;
        res.status(500).json( { message, data: error } );
      })
    }
  })
}