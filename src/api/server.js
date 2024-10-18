const express = require('express');
const cors = require('cors');
const routes = require('./api/routes/index.js'); // Corrigir o caminho conforme necessário

const app = express();

app.use(cors({
    origin: 'https://projeto-feiraciencias-tau.vercel.app' // Atualize com o domínio Vercel do seu frontend
}));

app.use(express.json());
routes(app);

module.exports = app;

