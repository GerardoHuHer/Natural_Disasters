import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryInfo = () => {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener la lista de países
  const fetchCountryList = () => {
    axios.get(`http://localhost:3001/pais`)
      .then(response => {
        setCountryList(response.data); // Actualizamos la lista de países
      })
      .catch(error => {
        setError('Error al obtener la lista de países');
        console.error('Error:', error);
      });
  };

  // Función para obtener la información del país seleccionado
  const fetchCountryData = (country) => {
    axios.get(`http://localhost:3001/dead/year?year=${year}`)
      .then(response => {
        setCountryData(response.data); // Actualizamos la información del país
        setError(null);
      })
      .catch(error => {
        setError('Error al obtener la información del país');
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    // Obtener la lista de países al cargar el componente
    fetchCountryList();
  }, []);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    fetchCountryData(country);
  };

  return (
    <div>
      {/* Mostrar la lista de botones de países */}
      <div>
        {countryList.map((country, index) => (
          <button key={index} onClick={() => handleCountryClick(country)}>
            {country}
          </button>
        ))}
      </div>

      {/* Mostrar la información del país seleccionado */}
      {countryData.length > 0 && (
        <div>
          <h2>{selectedCountry}</h2>
          <table>
            <thead>
              <tr>
                <th>Año</th>
                <th>Desastre Natural</th>
                <th>Defunciones</th>
              </tr>
            </thead>
            <tbody>
              {countryData.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.natural_disaster}</td>
                  <td>{item.defunciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default CountryInfo;
