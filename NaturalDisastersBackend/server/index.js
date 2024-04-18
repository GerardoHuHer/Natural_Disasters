const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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


app.get("/api/query", (req, res) => {
  const { year } = req.query;
  const query = `
    SELECT disasterType_id, magnitude_value, start_date 
    FROM disasters 
    WHERE YEAR(start_date) = ${year};`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener datos:", err);
      res.status(500).json({ error: "Error al obtener datos" });
    } else {
      res.json(results); // Envía los datos como JSON
    } 
  });
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

app.get("/dead/year/", (req, res)=>{
  const { year } = req.query;
  const query = `SELECT countries.name, YEAR(disasters.start_date) AS Anio ,SUM(disasters.people_dead) AS Total FROM disasters, countries	WHERE disasters.country_id=countries.id AND YEAR(disasters.start_date)>=${year} GROUP BY countries.name, Anio ORDER BY Anio,Total DESC LIMIT 50; `
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener datos:", err);
      res.status(500).json({ error: "Error al obtener datos" });
    } else {
      res.json(results); // Envía los datos como JSON
    } 
  });
})

app.get("/paises", (req, res) =>{
  const query = "SELECT name FROM `countries`; "
  db.query(query, (err, results) => {
    if(err){
      console.log("Error al obtener los datos: ", err);
      res.status(500).json({error: "Error al obtener los datos"});
    } else{
      res.json(results);
    }
  })
})
