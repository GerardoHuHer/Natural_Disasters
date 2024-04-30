import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function DesastresPorPais() {
  const [paises, setPaises] = useState([]);
  const [desastres, setDesastres] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [informacionQuery, setInformacionQuery] = useState([]);
  const [showTable, setShowTable] = useState(false); // Estado para mostrar/ocultar la tabla
  const [pieChartExists, setPieChartExists] = useState(false); // Estado para verificar si el gráfico de pastel existe

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
          if (!pieChartExists && document.getElementById('pieChart1')) {
            updatePieChart(data); // Si el gráfico de pastel no existe y el canvas está disponible, lo crea
            setPieChartExists(true); // Actualiza el estado para indicar que el gráfico de pastel existe
          }
        })
        .catch(error => {
          console.error('Error al obtener la información del query:', error);
        });
    }
  }, [paisSeleccionado, pieChartExists]);

  const handlePaisSeleccionadoChange = (event) => {
    setPaisSeleccionado(event.target.value);
    setPieChartExists(false); // Cuando cambia el país, el gráfico de pastel se reinicia
  };

  const handleToggleTable = () => {
    setShowTable(!showTable);
  };

  const updatePieChart = (data) => {
    const labels = data.map(item => item.type);
    const values = data.map(item => item.cantidad_desastres);

    const ctx = document.getElementById('pieChart1');
    if (ctx) {
      // Si el canvas ya existe, destruye el gráfico anterior
      Chart.getChart(ctx)?.destroy();
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de desastres por tipo',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Gráfico de Pastel: Cantidad de desastres por tipo'
          }
        }
      }
    });
  };

  return (
    <div>
      <div className='select-container'>
        <label htmlFor="pais">Selecciona un país:</label>
        <select id="pais" value={paisSeleccionado} onChange={handlePaisSeleccionadoChange}>
          <option value="">Selecciona un país</option>
          {paises.map(pais => (
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

      <div>
        <canvas id="pieChart1"></canvas>
      </div>
    </div>
  );
}

export default DesastresPorPais;
