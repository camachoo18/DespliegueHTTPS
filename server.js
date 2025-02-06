// server.js

const express = require('express');
const path = require('path');
const cors = require('cors'); // Importamos cors
const { getAllMessages, addMessage } = require('./database');
const app = express();
const port = 3000;

const API_KEY = '1234567890abcdef';  // API key hardcodeada

// Configuración de CORS: Permitir solicitudes desde el frontend específico
app.use(cors({
    origin: 'http://dev3.cyberbunny.online',  // Permite solicitudes solo desde tu dominio
    methods: ['GET', 'POST'],  // Permite solicitudes GET y POST
    allowedHeaders: ['Content-Type', 'APIKEY']  // Permite estos encabezados
}));

app.use(express.static(path.join(__dirname, 'public')));  // Sirve archivos estáticos desde la carpeta 'public'
app.use(express.json());

// Ruta para la página principal y servir el frontend
app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

    // Verificar si la APIKEY es válida
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: 'APIKEY no válida' });
    }

    if (!content) {
        return res.status(400).json({ error: 'El contenido del mensaje es obligatorio' });
    }

    const username = user && user.trim() ? user : 'Anónimo'; // Asignar "Anónimo" si el usuario no se proporciona

    addMessage(content, username, (err, message) => {
        if (err) {
            res.status(500).json({ error: 'Error al agregar el mensaje' });
        } else {
            res.status(201).json(message);  // Devolver el mensaje agregado
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
