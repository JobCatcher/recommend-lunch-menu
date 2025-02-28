import './App.css';
import './reset.css';
import MapProvider from './components/MapProvider';
import Home from './components/Home';

function App() {
  return (
    <MapProvider>
      <Home />
    </MapProvider>
  );
}

export default App;
