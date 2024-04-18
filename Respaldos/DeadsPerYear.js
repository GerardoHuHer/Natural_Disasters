import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Importa Chart.js
//import './styles2.css';

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
            label: 'Defunciones por país',
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
          maintainAspectRatio: false,
        },
      });
      setPieChart(chart); // Almacenar la instancia del gráfico de pastel en el estado
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        {Array.from({ length: 32 }, (_, i) => 1990 + i).map((year) => (
          <div key={year} className={`tab ${selectedYear === year ? 'selected' : ''}`} onClick={() => handleChange(year)}>
            {year}
          </div>
        ))}
      </div>

      <div className="content">
        <div className="table-container">
          {data && (
            <div>
              <h2>Datos para el año {selectedYear}:</h2>
              <table>
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
          <canvas id="pie-chart"></canvas>
        </div>
      </div>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Deads;