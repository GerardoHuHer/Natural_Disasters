const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const app = express();

// Configuración de CORS para que pueda extraer información de ciertos links
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

app.get("/principal", (req, res) => {
  const {country, year } = req.query;
  const query = `SELECT YEAR(disasters.start_date) AS Anio,(countries.name) AS Country, (disaster_types.group) AS Disaster_Type, (disaster_types.type) AS Tipo, SUM(disaster_types.type) AS No_Disaster_Type,SUM(disasters.people_dead) AS People_Dead
  FROM disasters, countries, disaster_types
  WHERE
    disasters.country_id=countries.id
  AND
      disasters.disasterType_id=disaster_types.id
  AND
    countries.name=?
  AND
    YEAR(disasters.start_date)=?
  GROUP BY Anio,Country, Disaster_Type, Tipo
  ORDER BY Anio,No_Disaster_Type,People_Dead DESC;`;

  db.query(query, [country, year], (err, results) => {
    if (err) {
      console.log("Error al obtener los datos: ", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});

app.get("/disasters", (req, res) =>{
  const query = "SELECT type FROM `disaster_types`;"
  db.query(query, (err, results) => {
    if(err){
      console.log("Error al obtener los datos: ", err);
      res.status(500).json({error: "Error al obtener los datos"});
    } else {
      res.json(results);
    }
  })
})

app.get("/distasters_per_country", (req, res) => {
  const { country } = req.query;
  const query = `SELECT countries.name AS Pais, disaster_types.type, COUNT(disasters.id) AS cantidad_desastres
  FROM disasters, disaster_types, countries
  WHERE
    countries.id = disasters.country_id AND
      disasters.disasterType_id = disaster_types.id AND
      countries.name = ?
  GROUP BY disaster_types.type  
  ORDER BY cantidad_desastres DESC
  Limit 10`
  db.query(query, [country], (err, results) => {
    if(err){
      console.log("Error al obtener los datos: ", err);
      res.status(500).json({error: "Error al obtener los datos"});
    } else {
      const formattedData = results.map(item => ({
        Pais: item.Pais,
        type: item.type,
        cantidad_desastres: item.cantidad_desastres
      }));
      res.json(formattedData);
    }
  })
})

app.get("/disaster_year", (req, res) => {
  const {country, disaster } = req.query;
  const query = `SELECT countries.name AS Pais, disaster_types.type, COUNT(disasters.id) AS cantidad_desastres, YEAR(disasters.start_date) as Anio
  FROM disasters, disaster_types, countries
  WHERE
    countries.id = disasters.country_id AND
      disasters.disasterType_id = disaster_types.id AND
      countries.name = ? AND
      disaster_types.type = ?
  GROUP BY disaster_types.type, Anio  
  ORDER BY cantidad_desastres DESC;`;

  db.query(query, [country, disaster], (err, results) => {
    if (err) {
      console.log("Error al obtener los datos: ", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(results);
    }
  });
});


// TERCER COMPONENTE
// Bubble chart, 
app.get("/costo/dano", (req, res) => {
  const { country, agno } = req.query;
  const query = `
    SELECT
      YEAR(disasters.start_date) AS Anio,
      countries.name AS Country,
      disaster_types.group AS Disaster_Type,
      disaster_types.type AS Tipo,
      SUM(disaster_types.type) AS No_Disaster_Type,
      SUM(disasters.reconstruction_costs) AS Reconstruction_Cost,
      SUM(disasters.total_damage) AS Total_Damage
    FROM
      disasters,
      countries,
      disaster_types
    WHERE
      disasters.country_id = countries.id AND
      disasters.disasterType_id = disaster_types.id AND
      countries.name = ? AND
      YEAR(disasters.start_date) = ?
    GROUP BY
      Anio, Country, Disaster_Type, Tipo
    ORDER BY
      Anio, No_Disaster_Type, Reconstruction_Cost, Total_Damage DESC;
  `;
  db.query(query, [country, agno], (err, result) => {
    if (err) {
      console.log("Error al obtener los datos ", err);
      res.status(500).json({ error: "Error al obtener datos" });
    } else {
      res.json(result);
    }
  });
});
