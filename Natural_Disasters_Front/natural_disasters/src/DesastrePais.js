import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function DesastresPorPais() {
  const [paises, setPaises] = useState([]);
  const [desastres, setDesastres] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [informacionQuery, setInformacionQuery] = useState([]);
  const [showTable, setShowTable] = useState(false); // Estado para mostrar/ocultar la tabla
  const [barChartExists, setBarChartExists] = useState(false); // Estado para verificar si el gráfico de barras existe

  useEffect(() => {
    fetch('http://localhost:3001/paises')
      .then(response => response.json())
      .then(data => {
        setPaises(data);
      })
      .catch(error => {
        console.error('Error al obtener la lista de países:', error);
      });

    fetch('http://localhost:3001/disasters')
      .then(response => response.json())
      .then(data => {
        setDesastres(data);
      })
      .catch(error => {
        console.error('Error al obtener la lista de desastres:', error);
      });
  }, []);

  useEffect(() => {
    if (paisSeleccionado) {
      fetch(`http://localhost:3001/distasters_per_country?country=${paisSeleccionado}`)
        .then(response => response.json())
        .then(data => {
          setInformacionQuery(data);
          if (!barChartExists && document.getElementById('barChart2')) {
            updateBarChart(data); // Si el gráfico de barras no existe y el canvas está disponible, lo crea
            setBarChartExists(true); // Actualiza el estado para indicar que el gráfico de barras existe
          }
        })
        .catch(error => {
          console.error('Error al obtener la información del query:', error);
        });
    }
  }, [paisSeleccionado, barChartExists]);

  const handlePaisSeleccionadoChange = (event) => {
    setPaisSeleccionado(event.target.value);
    setBarChartExists(false); // Cuando cambia el país, el gráfico de barras se reinicia
  };

  const handleToggleTable = () => {
    setShowTable(!showTable);
  };

  const updateBarChart = (data) => {
    const labels = data.map(item => item.type);
    const values = data.map(item => item.cantidad_desastres);
    const colors = generateRandomColors(data.length);

    const ctx = document.getElementById('barChart2');
    if (ctx) {
      // Si el canvas ya existe, destruye el gráfico anterior
      Chart.getChart(ctx)?.destroy();
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de desastres por tipo',
          data: values,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  };

  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`);
    }
    return colors;
  };

  return (
    <div className='main-container'>
      <div className='color-container'>
        <div className='paragraphs-container'>
          <p className='texto'>
            Select the country in order to see the number of each natural disaster occured in that country since 1950
          </p>
        </div>
        <div className='select-container'>
          <label htmlFor="pais">Selecciona un país:</label>
          <select id="pais" value={paisSeleccionado} onChange={handlePaisSeleccionadoChange}>
            <option value="">Selecciona un país</option>
            {paises
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(pais => (
              <option key={pais.name} value={pais.name}>{pais.name}</option>
            ))}
          </select>
        </div>

        <div>
          <button onClick={handleToggleTable}>{showTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}</button>
        </div>

        {showTable && (
          <div>
            <h2>Información del query para {paisSeleccionado}</h2>
            <table>
              <thead>
                <tr>
                  <th>Tipo de desastre</th>
                  <th>Cantidad de desastres</th>
                </tr>
              </thead>
              <tbody>
                {informacionQuery.map((item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>{item.cantidad_desastres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div id='barChart2-container'>
          <canvas id="barChart2"></canvas>
        </div>
      </div>
    </div>
  );
}

export default DesastresPorPais;
