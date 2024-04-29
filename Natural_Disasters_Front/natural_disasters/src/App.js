import './App.css';
import DisasterStatsComponent from './Componente_principal';
import DesastresPorPais from './DesastrePais';

function App() {
  return (
    <div className="App">
      <body>
        <DisasterStatsComponent/>
        <DesastresPorPais/>
      </body>
    </div>
  );
}

export default App;
