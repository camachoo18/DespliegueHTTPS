const express = require('express');
const cors = require('cors');  // Importamos el paquete cors
const app = express();

// Usamos CORS para permitir solicitudes desde cualquier origen
app.use(cors()); 

// Ruta principal que responde con el objeto
app.get('/', (req, res) => {
  res.json({ mensaje: "hola soy camacho" });
});

// Establece el puerto en el que el servidor estará escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
