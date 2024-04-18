import React, { useState, useEffect } from 'react';
import './styles.css'; // Importa los estilos CSS

const Componente1 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/borrames')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Tabla de Datos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ubicación</th>
            <th>Tipo Asociado</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.location}</td>
              <td>{item.associated_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Componente1;
