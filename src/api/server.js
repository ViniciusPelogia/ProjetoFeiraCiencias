const express = require('express'); // Importa o Express
const cors = require('cors'); // Importa o middleware cors
const routes = require('../api/routes/index.js'); // Importa as rotas da aplicação

const app = express(); // Cria uma instância do Express
const port = 5000; // Define a porta do servidor

// Configura o middleware CORS
app.use(cors({
    origin: 'http://localhost:3000' // Permite apenas requisições da origem especificada
}));

app.use(express.json()); // Middleware para fazer o parsing de JSON no corpo das requisições
routes(app); // Inicializa as rotas

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`); // Log que indica que o servidor está ativo
});
