import './App.css';
import DisasterStatsComponent from './Componente_principal';
import DesastresPorPais from './DesastrePais';
import CostosDano from './Costos';

function App() {
  return (
    <div className="App">
      <body>
        <DisasterStatsComponent/>
        <DesastresPorPais/>
       <CostosDano/> 
      </body>
    </div>
  );
}

export default App;
