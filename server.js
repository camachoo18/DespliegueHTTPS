const express = require('express');
const cors = require('cors');
const database = require('./database'); // Importa las funciones de la base de datos
const app = express();
const PORT = 3000;

// Middleware para permitir solicitudes CORS (si es necesario)
app.use(cors());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Middleware para parsear las query params en formato JSON
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de mensajes!');
});

// Obtener los mensajes
app.get('/messages', (req, res) => {
    const apiKey = req.headers['apikey'];

    // Verificamos la APIKEY
    if (apiKey !== '1234567890abcdef') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Obtener los mensajes de la base de datos
    database.getAllMessages((err, messages) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los mensajes' });
        }
        res.json({ messages });
    });
});

// Agregar un nuevo mensaje
app.post('/messages', (req, res) => {
    const apiKey = req.headers['apikey'];
    const { content, user } = req.query;

    // Verificamos la APIKEY
    if (apiKey !== '1234567890abcdef') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!content || !user) {
        return res.status(400).json({ error: 'El mensaje y el usuario son obligatorios' });
    }

    // Agregar el mensaje a la base de datos
    database.addMessage(content, user, (err, newMessage) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar el mensaje' });
        }
        res.json(newMessage);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
