import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Importa Chart.js
import './styles2.css';

const Deads = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [pieChart, setPieChart] = useState(null); // Estado para almacenar la instancia del gráfico de pastel

  useEffect(() => {
    // Crea o actualiza la gráfica de pastel cuando cambian los datos de la tabla
    if (data) {
      updatePieChart();
    }
  }, [data]);

  const handleChange = (year) => {
    setSelectedYear(year);
    fetchData(year);
  };

  const fetchData = (year) => {
    if (year === 'ALL') {
      // Si se selecciona 'ALL', mostrar una tabla diferente
      fetch(`http://localhost:3001/dead/all`)
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
    } else {
      fetch(`http://localhost:3001/dead/year?year=${year}`)
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
    }
  };

  const updatePieChart = () => {
    const countries = data.map(item => item.name);
    const deaths = data.map(item => item.Total);

    if (pieChart) {
      // Si la gráfica ya existe, actualiza los datos
      pieChart.data.labels = countries;
      pieChart.data.datasets[0].data = deaths;
      pieChart.update();
    } else {
      // Si la gráfica no existe, crea una nueva instancia
      const ctx = document.getElementById('pie-chart');
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: countries,
          datasets: [{
            data: deaths,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: 'Gráfica de defunciones', // Título de la gráfica
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: false, // Oculta la leyenda
            },
            tooltip: {
              enabled: true, // Habilita los tooltips
            },
          },
        },
      });
      setPieChart(chart); // Almacena la instancia del gráfico de pastel en el estado
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        <button onClick={() => window.location.reload()} className="back-button">Volver al inicio</button>
        {Array.from({ length: 32 }, (_, i) => 1990 + i).map((year) => (
          <div key={year} className={`tab ${selectedYear === year ? 'selected' : ''}`} onClick={() => handleChange(year)}>
            {year}
          </div>
        ))}
        <div className={`tab ${selectedYear === 'ALL' ? 'selected' : ''}`} onClick={() => handleChange('ALL')}>
          ALL
        </div>
      </div>

      <div className="content">
        <div className="table-container">
          {data && selectedYear !== 'ALL' && (
            <div>
              <h2>Datos para el año {selectedYear}:</h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>País</th>
                    <th>Defunciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.Total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data && selectedYear === 'ALL' && (
            <div>
              <h2>Todas las defunciones:</h2>
              <table className="styled-table">
                <thead>
                  <tr>                    
                    <th>País</th>
                    <th>Defunciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>                    
                      <td>{item.name}</td>
                      <td>{item.Total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="chart-container">
          <canvas id="pie-chart" width="200" height="200"></canvas>
        </div>
      </div>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Deads;
