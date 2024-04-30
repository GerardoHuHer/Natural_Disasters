import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const CostosDano = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const bubbleChartRef = useRef(null);
  const bubbleChartInstance = useRef(null);

  useEffect(() => {
    fetchCountries();
    createChart();
  }, []);

  const fetchCountries = () => {
    fetch('http://localhost:3001/paises')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };

  const fetchData = () => {
    if (!selectedYear || !selectedCountry) {
      alert('Por favor selecciona un año y un país.');
      return;
    }

    fetch(`http://localhost:3001/costo/dano?country=${selectedCountry}&agno=${selectedYear}`)
      .then(response => response.json())
      .then(data => {
        setChartData(data);
        setShowTable(true); // Mostrar la tabla después de recibir los datos
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const createChart = () => {
    const ctx = bubbleChartRef.current.getContext('2d');

    // Destruir la instancia anterior si existe
    if (bubbleChartInstance.current) {
      bubbleChartInstance.current.destroy();
    }

    bubbleChartInstance.current = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Costo de Reconstrucción',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Daño Total',
            },
          },
        },
      },
    });
  };

  const updateChart = () => {
    if (!bubbleChartInstance.current) return;
    
    bubbleChartInstance.current.data.datasets = [{
      label: 'Costo de Reconstrucción vs Daño Total',
      data: chartData.map(item => ({
        x: item.Reconstruction_Cost,
        y: item.Total_Damage,
        r: Math.sqrt(item.No_Disaster_Type) * 2, // Escalar el radio para mejorar la visualización
      })),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
    }];

    bubbleChartInstance.current.update();
  };

  useEffect(() => {
    updateChart();
  }, [chartData]);

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  return (
    <div>
      <div>
        <label htmlFor="year">Selecciona un año:</label>
        <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Selecciona un año</option>
          {Array.from({ length: 2022 - 2000 + 1 }, (_, index) => 2000 + index).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="country">Selecciona un país:</label>
        <select id="country" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">Selecciona un país</option>
          {countries.map(country => (
            <option key={country.name} value={country.name}>{country.name}</option>
          ))}
        </select>
      </div>
      <button onClick={fetchData}>Enviar</button>
      <canvas id="bubbleChart" ref={bubbleChartRef} width="600" height="400"></canvas>
      <button onClick={toggleTable}>{showTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}</button>
      {showTable && (
        <table>
          <thead>
            <tr>
              <th>Año</th>
              <th>País</th>
              <th>Tipo de desastre</th>
              <th>Tipo</th>
              <th>Total de desastres</th>
              <th>Costo de reconstrucción</th>
              <th>Total de daños</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, index) => (
              <tr key={index}>
                <td>{item.Anio}</td>
                <td>{item.Country}</td>
                <td>{item.Disaster_Type}</td>
                <td>{item.Tipo}</td>
                <td>{item.No_Disaster_Type}</td>
                <td>{item.Reconstruction_Cost}</td>
                <td>{item.Total_Damage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CostosDano;
