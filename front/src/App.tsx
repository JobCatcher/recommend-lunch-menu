import './App.css';
import './reset.css';
import MapProvider from './components/MapProvider';
import Home from './components/Home';
import GlobalNav from './components/navigation/GlobalNav';
import styled from '@emotion/styled';
import {GloablContext} from './context/GlobalNavContext';
import {useContext, useState} from 'react';

function App() {
  const globalContext = useContext(GloablContext);
  const [gnbState, setGnbState] = useState(globalContext);

  return (
    <GloablContext.Provider value={gnbState}>
      <Container>
        <GlobalNav setState={setGnbState} />
        <MapProvider>
          <Home setState={setGnbState} />
        </MapProvider>
      </Container>
    </GloablContext.Provider>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
