const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { getAllMessages, addMessage } = require('./database');

const app = express();
const port = 3000;

const API_KEY = '1234567890abcdef';  // API key hardcodeada

// Configuración de CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'APIKEY']
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta para la página principal
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de mensajes');
});

// Ruta para obtener los mensajes
app.get('/messages', (req, res) => {
    getAllMessages((err, messages) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los mensajes' });
        } else {
            res.json({ messages });
        }
    });
});

// Ruta para agregar un mensaje
app.post('/messages', (req, res) => {
    const { content, user } = req.query;
    const apiKey = req.headers['apikey'];

    // Verificar la APIKEY
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: 'APIKEY no válida' });
    }

    if (!content) {
        return res.status(400).json({ error: 'El contenido del mensaje es obligatorio' });
    }

    const username = user ? user : 'Anónimo';  // Asignar "Anónimo" si no hay usuario

    addMessage(content, username, (err, message) => {
        if (err) {
            res.status(500).json({ error: 'Error al agregar el mensaje' });
        } else {
            res.status(201).json(message);  // Devolver el mensaje agregado
        }
    });
});

// Configuración de HTTPS
const options = {
    cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')),
    key: fs.readFileSync(path.join(__dirname, 'privkey.pem'))
};

// Crear servidor HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`Servidor HTTPS en https://localhost:${port}`);
});
