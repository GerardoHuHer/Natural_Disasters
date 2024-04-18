import React, { useState } from 'react';

const YearSelector = () => {
  const [selectedYear, setSelectedYear] = useState(1990);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    fetch(`http://localhost:3001/api/query?year=${selectedYear}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(error => {
        setError('Error al obtener los datos');
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <label htmlFor="year">Selecciona un año:</label>
      <select id="year" value={selectedYear} onChange={handleChange}>
        {Array.from({ length: 32 }, (_, i) => 1990 + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Enviar</button>

      {error && <p>{error}</p>}

      {data && (
        <div>
          <h2>Datos para el año {selectedYear}:</h2>
          <ul>
            {data.map((item) => (
                  <li key={item.id}>{item.magnitude_value == 0 ? "": item.magnitude_value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YearSelector;
