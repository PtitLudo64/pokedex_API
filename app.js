const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const sequelize = require('./src/db/sequelize');
const env = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5500;


// MiddleWare
// app.use((req, res, next) => {
//     console.log(`URL : ${req.url}`);
//     next();
// });

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(bodyParser.json());

sequelize.initDb();

// Root endpoint.
app.get('/', (req, res) => {
    res.json("Pokedex API");
});

// All API endpoints.

require('./src/routes/findAllPokemons')(app);
require('./src/routes/findPokemonByPk')(app);
require('./src/routes/createPokemon')(app);
require('./src/routes/updatePokemon')(app);
require('./src/routes/deletePokemon')(app);
require('./src/routes/login')(app);

// Gestions des erreurs
// 404
app.use(({res}) => {
    const message = "URL non disponible, vérifiez votre demande.";
    res.status(404).json({message});
});

app.listen(port, () => console.log(`L\'application NODE est démarrée sur http://localhost:${port}`));
