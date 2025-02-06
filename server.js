const express = require('express');
const path = require('path');
const cors = require('cors');
const { getAllMessages, addMessage } = require('./database');
const app = express();
const port = 3000;

const API_KEY = '1234567890abcdef';  // API key hardcodeada

// Configuración de CORS: Permitir solicitudes de todos los orígenes y métodos (GET, POST, etc.)
app.use(cors({
    origin: '*',  // Permite solicitudes desde cualquier origen
    methods: ['GET', 'POST'],  // Permite solicitudes GET y POST
    allowedHeaders: ['Content-Type', 'APIKEY']  // Permite estos encabezados
}));

app.use(express.static(path.join(__dirname, 'public')));  // Sirve archivos estáticos desde la carpeta 'public'
app.use(express.json());

// Ruta para obtener los mensajes (debe estar antes de la ruta para servir el HTML)
app.get('/messages', (req, res) => {
    getAllMessages((err, messages) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los mensajes' });
        } else {
            res.json({ messages });  // Respuesta JSON con los mensajes
        }
    });
});

// Ruta para agregar un mensaje (POST)
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

    const username = user ? user : 'Anónimo'; // Asignar "Anónimo" si el usuario no se proporciona

    addMessage(content, username, (err, message) => {
        if (err) {
            res.status(500).json({ error: 'Error al agregar el mensaje' });
        } else {
            res.status(201).json(message);  // Devolver el mensaje agregado
        }
    });
});

// Ruta para servir el archivo HTML, debe estar después de las rutas para la API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Sirve el archivo index.html cuando se accede a /
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
