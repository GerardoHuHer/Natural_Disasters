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
    destroyCharts(); // Destruye los gráficos existentes antes de crear nuevos
    if (data.length > 0) {
      createCharts();
      setShowCharts(true);
    }
  }, [data, year, country]); // Añade year y country como dependencias

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

    const pieChartTitle = year && country ? `Natural disasters of ${year} in ${country}` : '';

    if (pieChart) {
      pieChart.destroy();
    }
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
          },
          title: {
            display: true,
            text: pieChartTitle
          }
        }
      }
    });
    setPieChart(newPieChart);

    const barChartData = data.map(item => ({ label: item.Tipo, value: item.People_Dead }));
    const barChartLabels = barChartData.map(item => item.label);
    const barChartValues = barChartData.map(item => item.value);

    const barChartTitle = year && country ? `Number of deaths in ${year} in ${country}` : '';

    if (barChart) {
      barChart.destroy();
    }
    const newBarChart = new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: barChartLabels,
        datasets: [{
          label: 'Number of Deaths',
          data: barChartValues,
          backgroundColor: '#3C55D1',
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
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
        },
        plugins: {
          title: {
            display: true,
            text: barChartTitle
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
      <h1 className="title">NATURAL DISASTERS</h1>
      <div className='color-container'>
        <div className='paragraphs-container'>
          <div className='twoParagraphs-container'>
            <p className='texto'>The historical records of the countries of the world, hold a curious ambiguity regarding the number 
              of natural disasters that occurred. While some events are well-documented, others remain obscured by 
              the passage of time, leaving a lingering uncertainty.
            </p>
            <p className='texto'>
              This data serves as a crucial tool for decision-making 
              in preparing for future disasters, prompting further exploration to ascertain the complete picture of such 
              occurrences.
            </p>
          </div>
          <div className='thirdParagrah-container'>
            <p className='texto'>
              Select the year and the country to find out the number of natural disasters that occurred in that 
              country and year
            </p>
          </div>
        </div>
      </div>
      <div className="select-container">
        <div className="select-wrapper">
          <label htmlFor="year">Select the year: </label>
          <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="select-wrapper">
          <label htmlFor="country">Select the country: </label>
          <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Country</option>
            {countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(country => (
              <option key={country.name} value={country.name}>{country.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>

      <div className='graph-text-container'>
        <div className='pie-text-container'>
          <div className='pie-text'>
            <p>This pie chart shows the total number of natural disasters that have occured in {country} in the year {year}</p>
          </div>
          <div className="charts-container">
            <div className="chart">
              <canvas id="pieChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div className='graph-text-container'>
        <div className='bar-text-container'>
          <div className='bar-text'>
            <p>This bar chart shows the number of deaths in the disasters that occurred in {country} in the year {year}.</p>
          </div>
          <div className='barGraph'>
            <canvas id="barChart"></canvas>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <button onClick={handleToggleTable}>
          {showTable ? 'Hide Table' : 'Show Table'}
        </button>
        {showTable && data.length > 0 && ( 
          <table className="data-table">
            <thead>
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
