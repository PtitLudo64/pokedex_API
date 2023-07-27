const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth');
  
module.exports = (app) => {
  app.get('/api/pokemons/:id', auth, (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then(pokemon => {
        if (pokemon === null) {
          const message = 'Le Pokémon demandé n\'a pas été trouvé. réessayez dans quelques instants.';
          return res.status(404).json({message});
        }
        const message = 'Un pokémon a été trouvé.';
        res.json({ message, data: pokemon });
      })
      .catch(error => {
        const message = `Ce Pokemons n'a pas pu être récupéré. Réessayez dans quelques instants.`;
        res.status(500).json({message, data: error});
      })
  })
}