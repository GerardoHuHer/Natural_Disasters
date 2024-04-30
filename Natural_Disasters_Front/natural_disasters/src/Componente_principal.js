import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './styles_principal.css';

const DisasterStatsComponent = () => {
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const years = Array.from({ length: 2022 - 1990 + 1 }, (_, index) => 1990 + index);
  const [pieChart, setPieChart] = useState(null);
  const [barChart, setBarChart] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/paises')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      createCharts();
      setShowCharts(true);
    }
  }, [data]);

  const fetchData = () => {
    fetch(`http://localhost:3001/principal?year=${year}&country=${country}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const createCharts = () => {
    destroyCharts();

    const disastersData = data.map(item => ({ label: item.Tipo, value: item.No_Disaster_Type }));
    const sortedDisastersData = disastersData.sort((a, b) => b.value - a.value);
    const uniqueDisastersCount = new Set(disastersData.map(item => item.label)).size;

    let pieChartData = sortedDisastersData;
    if (uniqueDisastersCount > 7) {
      pieChartData = sortedDisastersData.map(item => ({
        label: item.value >= (0.05 * getTotalDisasters(sortedDisastersData)) || item.label === 'Others' ? item.label : 'Others',
        value: item.value
      }));

      const othersIndex = pieChartData.findIndex(item => item.label === 'Others');
      if (othersIndex !== -1) {
        const othersCount = pieChartData.filter(item => item.label === 'Others').length;
        if (othersCount > 1) {
          const othersValue = pieChartData.filter(item => item.label !== 'Others').reduce((acc, curr) => acc + curr.value, 0);
          pieChartData = pieChartData.filter(item => item.label !== 'Others');
          pieChartData.push({ label: 'Others', value: othersValue });
        }
      }
    }

    const pieChartLabels = pieChartData.map(item => item.label);
    const pieChartValues = pieChartData.map(item => item.value);

    const newPieChart = new Chart(document.getElementById('pieChart'), {
      type: 'pie',
      data: {
        labels: pieChartLabels,
        datasets: [{
          label: 'Disasters by Type',
          data: pieChartValues,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8E5EA2', '#FF6600'],
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
    setPieChart(newPieChart);

    const barChartData = data.map(item => ({ label: item.Tipo, value: item.People_Dead }));
    const barChartLabels = barChartData.map(item => item.label);
    const barChartValues = barChartData.map(item => item.value);

    const newBarChart = new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: barChartLabels,
        datasets: [{
          label: 'Number of Deaths',
          data: barChartValues,
          backgroundColor: '#36A2EB',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Deaths'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Disaster Type'
            }
          }
        }
      }
    });
    setBarChart(newBarChart);
  };

  const destroyCharts = () => {
    if (pieChart) {
      pieChart.destroy();
      setPieChart(null);
    }
    if (barChart) {
      barChart.destroy();
      setBarChart(null);
    }
  };

  const getTotalDisasters = (data) => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  };

  const handleFetchData = () => {
    fetchData();
  };

  const handleToggleTable = () => {
    setShowTable(!showTable);
  };

  return (
    <div className="container">
      <h1 className="title">Desastres Naturales</h1>
      <div className='instrucciones'>Seleccione el año y el país: </div>
      <div className="select-container">
        <div className="select-wrapper">
          <label htmlFor="year">Select Year:</label>
          <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Yearre</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="select-wrapper">
          <label htmlFor="country">Select Country:</label>
          <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country.name} value={country.name}>{country.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Pie Chart</h3>
          <canvas id="pieChart"></canvas>
        </div>
        <div className="chart">
          <h3>Bar Chart</h3>
          <canvas id="barChart"></canvas>
        </div>
      </div>

      <div className="table-container">
        <button onClick={handleToggleTable}>
          {showTable ? 'Hide Table' : 'Show Table'}
        </button>
        {showTable && data.length > 0 && ( 
          <table className="data-table">
            <thead className='table-head-container'>
              <tr>
                <th>Year</th>
                <th>Country</th>
                <th>Disaster Type</th>
                <th>Type</th>
                <th>Total Desastres</th>
                <th>People Dead</th>
              </tr>
            </thead>
            <tbody className='tbody'>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.Anio}</td>
                  <td>{item.Country}</td>
                  <td>{item.Disaster_Type}</td>
                  <td>{item.Tipo}</td>
                  <td>{item.No_Disaster_Type}</td>
                  <td>{item.People_Dead}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DisasterStatsComponent;
