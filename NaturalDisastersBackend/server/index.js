const express = require("express");
const mysql = require('mysql');
const cors = require('cors'); // Importar el módulo cors
const PORT = process.env.PORT || 3001;
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza esto con el origen de tu frontend
  optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, varios SmartTVs) interpretan correctamente solo la respuesta predeterminada si se establece explícitamente.
};

app.use(cors(corsOptions)); // Utilizar el middleware de CORS

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'natural_disasters'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
      console.log('Conexión exitosa a la base de datos');
  }
});

app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the backend!" });
  });

app.get("/api/borrames", (req, res) => {
    const query = `
        SELECT disaster_locations.id, disaster_locations.location, associated_types.associated_type 
        FROM disaster_locations 
        INNER JOIN associated_types ON disaster_locations.disaster_id = associated_types.disaster_id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener datos:", err);
            res.status(500).json({ error: "Error al obtener datos" });
        } else {
            res.json(results); // Envía los datos como JSON
        } 
    });
});
